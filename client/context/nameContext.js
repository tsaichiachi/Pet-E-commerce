import React, {createContext, useContext, useState} from "react";

export const NameContext= createContext();

export const NameProvider = ({children}) => {
    const [contextName, setContextName] = useState('');

    return(
        <NameContext.Provider value={{contextName, setContextName}}>
            {children}
        </NameContext.Provider>
    )
    
}

export const useName = () =>{
    const context = useContext(NameContext)
    if(!context){
        throw new Error('useName必須在NameProvider中使用')
    }
    return context
}

