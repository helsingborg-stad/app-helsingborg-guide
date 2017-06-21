/**
 * Created by msaeed on 2017-02-09.
 */
module.exports = ()=>{

    function toTimeMarker(_seconds) {
        let seconds = Math.floor(_seconds);
        let h,m,s;
        if(!seconds || seconds<0)
            return '';
        if(seconds<60)
            return '00:'+add0(seconds);
        if(seconds<3600){
            m = parseInt(seconds/60);
            s= (seconds%60);
            return add0(m)+':'+add0(s);

        }
        else{
            h= parseInt(seconds/3600);
            let r=seconds%3600;
            m= parseInt(r/60);
            s=r%60;

        }
            return add0(h)+':'+add0(m)+':'+add0(s);

    }

    function add0(number) {
        return (number<10)?('0'+number):number;
    }

    return {
        toTimeMarker
    }
};