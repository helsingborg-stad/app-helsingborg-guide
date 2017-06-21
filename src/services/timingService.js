import {LangService} from "./langService";

let instance = null;

export class TimingService{

    constructor() {

    }
    static getInstance(){
        if(!instance)
            instance = new TimingService();
        return instance;
    }

    getOpeningHours(openingList, expList){
        const now = new Date();

        if(!openingList || !openingList.length)
            return null;
        if(expList && expList.length){
            let exp = expList.find(item=>now.toDateString() == (new Date(item.exception_date)).toDateString() );
            if(exp)
                return exp.exeption_information;
        }

        let openingObj = openingList.find(item=> item.day_number == now.getDay());

        if(!openingObj)
            return null;

        if(openingObj.closed)
            return LangService.strings.CLOSE_TODAY;

        return LangService.strings.OPEN_TODAY +' '+ openingObj.opening + '-' + openingObj.closing


    }



}