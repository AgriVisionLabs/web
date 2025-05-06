import { useState } from "react";

const Menu = (items) => {
    let children=items.item;
    return (
        <div className=" px-4 py-1 hover:text-mainColor hover:bg-slate-200 cursor-pointer " onClick={()=>{items.setIndex(items.index)}}>
            <p>{children}</p> 
        </div>
        
    );
}

export default Menu;
