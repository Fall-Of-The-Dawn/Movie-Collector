import { use, useEffect } from "react"
const Value = ({v,setinitialvalue})=>  {
    v=v+1
    const collect = ()=>{
        
    }
    useEffect(()=>{
        setinitialvalue(v)
    }, [v,setinitialvalue])
    return v
}
export default Value