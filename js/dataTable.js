class dataTable{
    element; 
    headers; 
    items; 
    copyItems; 
    selected; 
    pagination; 
    numberOfEntries; 
    headerButtons; 

    constructor(selector, headerButtons){
        this.element = document.querySelector(selector); 

        this.headers = []; 
        this.items   = []; 
        this.pagination = {
            total : 0, 
            noItemsPerPage:0,
            noPages:0,
            actual:0,
            pointer:0, 
            diff:0, 
            lastPageBeforeDots: 0, 
            noButtonsBeforeDots:4
        }; 
        this.selected=[]; 
        this.numberOfEntries = 5; 
        this.headerButtons = headerButtons;

    }

    parse(){
        const headers = [... this.element.querySelector('thead tr').children]; 
        const trs = [... this.element.querySelector('tbody').children]; 

        headers.forEach(element=>{
            this.headers.push(element.textContent); 

        }); 

        headers.forEach(tr=>{
            const cells = [... tr.children]; 
            const item ={
                id: this.generateUUID(), 
                values:[]
            }; 

            cells.forEach(cell =>{
                if(cell.children.length > 0){
                    const status =[... cell.children][0].getAtrribute('clase'); 
                    if (status != null ){
                        item.values.push('<span>')
                    }
                }
            });

        }); 

        console.log(this.headers); 
    }

    generateUUID(){
        return(Date.now()*Math.floor(Math.random()*1000)).toString();
    }
}