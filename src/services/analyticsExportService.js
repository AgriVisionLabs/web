import axios from 'axios';

/**
 * Service for exporting analytics reports
 */
class AnalyticsExportService {
  constructor(baseUrl, token) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  /**
   * Get time period in days based on period string
   */
  getTimePeriodInDays(periodString) {
    const periodMap = {
      "Last 7 days": 7,
      "Last 30 days": 30,
      "Last 90 days": 90,
      "Last 6 months": 180,
      "Last year": 365
    };
    return periodMap[periodString] || 30;
  }

  /**
   * Get date range for the given period
   */
  getDateRange(periodString) {
    const days = this.getTimePeriodInDays(periodString);
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - (days * 24 * 60 * 60 * 1000));
    
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      days
    };
  }

  /**
   * Fetch tasks data for export
   */
  async fetchTasksData(farmId) {
    try {
      const response = await axios({
        url: `${this.baseUrl}/farms/${farmId}/Tasks`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks data for export:", error);
      return [];
    }
  }

  /**
   * Fetch irrigation events data for export
   */
  async fetchIrrigationData(farmId) {
    try {
      const response = await axios({
        url: `${this.baseUrl}/farms/${farmId}/irrigationevents`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      return response.data || [];
    } catch (error) {
      console.error("Error fetching irrigation data for export:", error);
      return [];
    }
  }

  /**
   * Fetch disease detection data for export (for specific farm)
   */
  async fetchDiseaseDetectionData(farmId) {
    try {
      // Get fields for the specific farm
      const fieldsResponse = await axios({
        url: `${this.baseUrl}/farms/${farmId}/Fields`,
        method: "GET",
        headers: { Authorization: `Bearer ${this.token}` },
      });
      
      const fields = fieldsResponse.data || [];
      let allDetections = [];

      // Fetch detections for each field
      for (const field of fields) {
        try {
          const detectionsResponse = await axios({
            url: `${this.baseUrl}/farms/${farmId}/fields/${field.id}/diseasedetections`,
            method: "GET",
            headers: { Authorization: `Bearer ${this.token}` },
          });
          
          const detections = (detectionsResponse.data || []).map(detection => ({
            ...detection,
            fieldName: field.name,
            fieldId: field.id,
            cropName: field.cropName || detection.cropName
          }));
          
          allDetections = [...allDetections, ...detections];
        } catch (error) {
          console.error(`Error fetching detections for field ${field.id}:`, error);
        }
      }
      
      return allDetections;
    } catch (error) {
      console.error("Error fetching disease detection data for export:", error);
      return [];
    }
  }

  /**
   * Fetch inventory transactions data for export
   */
  async fetchInventoryData(farmId) {
    try {
      const response = await axios({
        url: `${this.baseUrl}/farms/${farmId}/inventoryitemtransactions`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      return response.data || [];
    } catch (error) {
      console.error("Error fetching inventory data for export:", error);
      return [];
    }
  }

  /**
   * Process and analyze tasks data
   */
  processTasksData(tasks, dateRange) {
    const categories = [
      "Irrigation",
      "Fertilization", 
      "PlantingOrHarvesting",
      "Maintenance",
      "Inspection",
      "PestAndHealthControl"
    ];

    const categoryDisplayNames = {
      "PlantingOrHarvesting": "Planting/Harvesting",
      "PestAndHealthControl": "Pest & Health Control"
    };

    // Filter tasks within date range
    const filteredTasks = tasks.filter(task => {
      const taskDate = new Date(task.createdAt || task.dueDate);
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      return taskDate >= startDate && taskDate <= endDate;
    });

    // Calculate status distribution
    const now = new Date();
    const completed = filteredTasks.filter(task => task.completedAt).length;
    const inProgress = filteredTasks.filter(task => task.assignedToId && !task.completedAt).length;
    const pending = filteredTasks.filter(task => !task.assignedToId && !task.claimedById && !task.completedAt).length;
    const overdue = filteredTasks.filter(task => {
      if (task.completedAt) return false;
      if (!task.dueDate) return false;
      return new Date(task.dueDate) < now;
    }).length;

    // Calculate category distribution
    const categoryStats = {};
    categories.forEach((category, index) => {
      const displayName = categoryDisplayNames[category] || category;
      const count = filteredTasks.filter(task => task.category === index).length;
      categoryStats[displayName] = count;
    });

    // Calculate field distribution
    const fieldStats = {};
    filteredTasks.forEach(task => {
      const fieldName = task.fieldName || 'Unknown Field';
      if (!fieldStats[fieldName]) {
        fieldStats[fieldName] = { high: 0, medium: 0, low: 0, total: 0 };
      }
      
      fieldStats[fieldName].total++;
      if (task.itemPriority === 2) fieldStats[fieldName].high++;
      else if (task.itemPriority === 1) fieldStats[fieldName].medium++;
      else fieldStats[fieldName].low++;
    });

    return {
      totalTasks: filteredTasks.length,
      statusDistribution: {
        completed,
        inProgress,
        pending,
        overdue
      },
      categoryDistribution: categoryStats,
      fieldDistribution: fieldStats,
      completionRate: filteredTasks.length > 0 ? Math.round((completed / filteredTasks.length) * 100) : 0
    };
  }

  /**
   * Process irrigation data
   */
  processIrrigationData(events, dateRange) {
    const filteredEvents = events.filter(event => {
      const eventDate = new Date(event.startTime);
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      return eventDate >= startDate && eventDate <= endDate;
    });

    const totalHours = filteredEvents.reduce((sum, event) => {
      const duration = (new Date(event.endTime) - new Date(event.startTime)) / (1000 * 60 * 60);
      return sum + Math.max(duration, 0);
    }, 0);

    return {
      totalEvents: filteredEvents.length,
      totalHours: Math.round(totalHours * 10) / 10,
      averageHoursPerEvent: filteredEvents.length > 0 ? Math.round((totalHours / filteredEvents.length) * 10) / 10 : 0
    };
  }

  /**
   * Process inventory data
   */
  processInventoryData(transactions, dateRange) {
    const filteredTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.transactionDate);
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      return transactionDate >= startDate && transactionDate <= endDate;
    });

    const categories = ["Fertilizer", "Chemicals", "Treatments", "Produce"];
    const reasons = ["Restock", "Usage", "Expired", "Transfer", "Manual Adjustment"];

    // Category breakdown
    const categoryStats = {};
    categories.forEach((category, index) => {
      const categoryTransactions = filteredTransactions.filter(t => t.itemCategory === index);
      const totalValue = categoryTransactions.reduce((sum, t) => sum + Math.abs(t.quantityChanged * t.unitCost), 0);
      categoryStats[category] = {
        transactions: categoryTransactions.length,
        totalValue,
        totalQuantity: categoryTransactions.reduce((sum, t) => sum + Math.abs(t.quantityChanged), 0)
      };
    });

    // Reason breakdown
    const reasonStats = {};
    reasons.forEach((reason, index) => {
      const reasonTransactions = filteredTransactions.filter(t => t.reason === index);
      reasonStats[reason] = reasonTransactions.length;
    });

    const totalSpending = filteredTransactions.reduce((sum, t) => sum + Math.abs(t.quantityChanged * t.unitCost), 0);

    return {
      totalTransactions: filteredTransactions.length,
      totalSpending,
      categoryBreakdown: categoryStats,
      reasonBreakdown: reasonStats,
      averageTransactionValue: filteredTransactions.length > 0 ? totalSpending / filteredTransactions.length : 0
    };
  }

  /**
   * Process disease detection data
   */
  processDiseaseDetectionData(detections, dateRange) {
    const filteredDetections = detections.filter(detection => {
      // Use createdOn field as Plant Health component does
      const detectionDate = new Date(detection.createdOn || detection.createdAt || detection.detectionDate);
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      return detectionDate >= startDate && detectionDate <= endDate;
    });

    // Calculate healthy percentage like PlantHealth component
    const healthyDetections = filteredDetections.filter(d => d.healthStatus === 0 || d.isHealthy === true);
    const unhealthyDetections = filteredDetections.filter(d => d.healthStatus !== 0 && d.diseaseName);
    
    const diseaseTypes = {};
    unhealthyDetections.forEach(detection => {
      let disease = detection.diseaseName || 'Unknown Disease';
      
      // Handle video analysis cases like PlantHealth
      if (disease === 'Unknown Disease' && detection.imageUrl && detection.imageUrl.includes('composite')) {
        disease = 'Video Analysis Detection';
      } else if (disease === 'Unknown Disease') {
        disease = 'Unidentified Disease';
      }
      
      diseaseTypes[disease] = (diseaseTypes[disease] || 0) + 1;
    });

    // Calculate average confidence for unhealthy detections only
    const avgConfidenceUnhealthy = unhealthyDetections.length > 0 
      ? Math.round((unhealthyDetections.reduce((sum, d) => sum + (d.confidence || 0), 0) / unhealthyDetections.length) * 100) / 100
      : 0;

    const healthyPercentage = filteredDetections.length > 0 
      ? Math.round((healthyDetections.length / filteredDetections.length) * 100)
      : 0;

    return {
      totalDetections: filteredDetections.length,
      healthyDetections: healthyDetections.length,
      unhealthyDetections: unhealthyDetections.length,
      healthyPercentage,
      diseaseTypes,
      averageConfidence: avgConfidenceUnhealthy
    };
  }

  /**
   * Generate CSV content from data
   */
  generateCSV(farmName, periodString, tasksData, irrigationData, diseaseData, inventoryData) {
    const dateRange = this.getDateRange(periodString);
    
    let csv = `Analytics Report for ${farmName}\n`;
    csv += `Period: ${periodString} (${dateRange.startDate} to ${dateRange.endDate})\n`;
    csv += `Generated: ${new Date().toLocaleDateString()}\n\n`;

    // Tasks Summary
    csv += `TASKS SUMMARY\n`;
    csv += `Total Tasks,${tasksData.totalTasks}\n`;
    csv += `Completion Rate,${tasksData.completionRate}%\n\n`;

    csv += `Task Status Distribution\n`;
    csv += `Status,Count\n`;
    csv += `Completed,${tasksData.statusDistribution.completed}\n`;
    csv += `In Progress,${tasksData.statusDistribution.inProgress}\n`;
    csv += `Pending,${tasksData.statusDistribution.pending}\n`;
    csv += `Overdue,${tasksData.statusDistribution.overdue}\n\n`;

    csv += `Task Categories\n`;
    csv += `Category,Count\n`;
    Object.entries(tasksData.categoryDistribution).forEach(([category, count]) => {
      csv += `${category},${count}\n`;
    });
    csv += `\n`;

    csv += `Tasks by Field and Priority\n`;
    csv += `Field,High Priority,Medium Priority,Low Priority,Total\n`;
    Object.entries(tasksData.fieldDistribution).forEach(([field, data]) => {
      csv += `${field},${data.high},${data.medium},${data.low},${data.total}\n`;
    });
    csv += `\n`;

    // Irrigation Summary
    csv += `IRRIGATION SUMMARY\n`;
    csv += `Total Events,${irrigationData.totalEvents}\n`;
    csv += `Total Hours,${irrigationData.totalHours}\n`;
    csv += `Average Hours per Event,${irrigationData.averageHoursPerEvent}\n\n`;

    // Disease Detection Summary
    csv += `DISEASE DETECTION SUMMARY\n`;
    csv += `Total Detections,${diseaseData.totalDetections}\n`;
    csv += `Healthy Detections,${diseaseData.healthyDetections}\n`;
    csv += `Unhealthy Detections,${diseaseData.unhealthyDetections}\n`;
    csv += `Healthy Percentage,${diseaseData.healthyPercentage}%\n`;
    csv += `Average Confidence (Unhealthy),${diseaseData.averageConfidence}%\n\n`;

    csv += `Disease Types\n`;
    csv += `Disease,Count\n`;
    Object.entries(diseaseData.diseaseTypes).forEach(([disease, count]) => {
      csv += `${disease},${count}\n`;
    });
    csv += `\n`;

    // Inventory Summary
    csv += `INVENTORY SUMMARY\n`;
    csv += `Total Transactions,${inventoryData.totalTransactions}\n`;
    csv += `Total Spending,EGP ${inventoryData.totalSpending.toLocaleString()}\n`;
    csv += `Average Transaction Value,EGP ${Math.round(inventoryData.averageTransactionValue * 100) / 100}\n\n`;

    csv += `Inventory Categories\n`;
    csv += `Category,Transactions,Total Value (EGP),Total Quantity\n`;
    Object.entries(inventoryData.categoryBreakdown).forEach(([category, data]) => {
      csv += `${category},${data.transactions},${data.totalValue.toLocaleString()},${data.totalQuantity}\n`;
    });
    csv += `\n`;

    csv += `Transaction Reasons\n`;
    csv += `Reason,Count\n`;
    Object.entries(inventoryData.reasonBreakdown).forEach(([reason, count]) => {
      csv += `${reason},${count}\n`;
    });

    return csv;
  }

  /**
   * Download CSV file
   */
  downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  /**
   * Export analytics report
   */
  async exportReport(farmId, farmName, periodString) {
    try {
      const dateRange = this.getDateRange(periodString);
      
      // Fetch all data in parallel
      const [tasks, irrigationEvents, diseaseDetections, inventoryTransactions] = await Promise.all([
        this.fetchTasksData(farmId),
        this.fetchIrrigationData(farmId),
        this.fetchDiseaseDetectionData(farmId),
        this.fetchInventoryData(farmId)
      ]);

      // Process data
      const tasksData = this.processTasksData(tasks, dateRange);
      const irrigationData = this.processIrrigationData(irrigationEvents, dateRange);
      const diseaseData = this.processDiseaseDetectionData(diseaseDetections, dateRange);
      const inventoryData = this.processInventoryData(inventoryTransactions, dateRange);

      // Generate CSV
      const csvContent = this.generateCSV(farmName, periodString, tasksData, irrigationData, diseaseData, inventoryData);
      
      // Generate filename
      const filename = `${farmName}_Analytics_${periodString.replace(/\s+/g, '_')}_${dateRange.startDate}_to_${dateRange.endDate}.csv`;
      
      // Download file
      this.downloadCSV(csvContent, filename);
      
      return { success: true, message: 'Report exported successfully' };
    } catch (error) {
      console.error('Error exporting analytics report:', error);
      return { success: false, message: 'Failed to export report: ' + error.message };
    }
  }
}

export default AnalyticsExportService;