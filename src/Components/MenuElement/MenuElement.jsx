import  {  useEffect, useRef, useState} from 'react';
import Menu from '../Menu/Menu';
const MenuElement = (children) => {
            let [onList,setOnList]=useState(null)
            let Items=children.Items;
            let width=children.width;
            let name =children.name;
            let nameChange =children.nameChange;
            let textColor =children.textColor;
            let classformat=children.className;
            let Pformat=children.Pformat;
            const iconRef=useRef(null);
            const listRef=useRef(null);
            function openList(){
                const element=iconRef.current?.classList;
                const element2=listRef.current?.classList;
                console.log(element)
                if(onList){
                    setOnList(false);
                    element.remove("fa-angle-down");
                    element.add("fa-angle-up");
                    element2.remove("border-transparent");
                    element2.remove("h-0");
                    element2.add(`h-[${12*Items.length}]`);
                    element2.add("border-[1px]");
                    element2.add("border-[#0d121c21]")
                    
                    
                }else{
                    setOnList(true);
                    element.remove("fa-angle-up");
                    element.add("fa-angle-down");
                    element2.remove(`h-[${12*Items.length}]`);
                    element2.add("border-transparent");
                    element2.add("h-0");
                    element2.remove("border-[1px]");
                    element2.remove("border-[#0d121c21]")
                }
            }
            // useEffect(()=>{
            //     openList();
            // },[]);
            useEffect(()=>{
                if((nameChange||name)){openList();}
            },[children.index]);
    return (
        <div className={`forms    transition-all duration-500   relative  cursor-pointer`} style={{ width:width}}>
                        <div className={`icon flex justify-between  items-center rounded-lg border-[1px] px-5 py-2 mb-[4px] border-[#0d121c21] ${classformat} `} onClick={()=>{
                                openList()
                            }}>
                            {nameChange||name?
                            <><p className={`text-[17px] font-[400] capitalize ${Pformat}`} style={{ color:textColor}}>{nameChange?nameChange:name}</p>
                            <i className=" fa-solid cursor-pointer fa-angle-down " ref={iconRef}></i></>:
                            <p className={`text-[17px] font-[400] capitalize ${Pformat}`}>Data is not available</p>
                            }
                        </div>
                        <div className="list    transition-all duration-500 overflow-hidden rounded-lg  bg-[#ffffff] z-10 absolute left-0 right-0  h-0" ref={listRef}>
                        <div className="max-h-[120px] overflow-y-auto">
                        {
                            Items?.map((e,index)=><Menu key={index} index={index} item={e} setIndex={children.setIndex}/>)
                        }
                        </div>
                        </div>
                    
        </div>
    );
}

export default MenuElement;
