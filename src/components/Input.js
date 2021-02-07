import React from 'react'

export default function Input(props) {
    const {label,name,error,onChange, type ,defaultValue} = props
    let className = 'form-control';

    if(type==='file'){ //eger gelen input file tipindeyse style icin ekleme yapariz
        className += '-file';
    }
    if(error!==undefined){ //eger inputun hatasi varsa ekleme yapariz
        className += ' is-invalid';
    }

    return (
        <div className="form-group">
        <label>{label}</label>
        <input className={className} name={name} onChange={onChange}  type={type} defaultValue={defaultValue}/>
<div className="invalid-feedback">{error}</div> {//username hatasi var ise yazdiracak
}

    </div>
    )
}
