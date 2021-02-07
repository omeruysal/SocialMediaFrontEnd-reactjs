import React from 'react'

export default function ButtonWithProgress(props) {
    const {onClick,pendingApiCall,disabled,text,className} =props;
    return (
            <button className={className ||"btn btn-primary"} onClick={onClick} disabled={disabled} > 
                {pendingApiCall ? <span className="spinner-border spinner-border-sm"></span> : ''}
    {text}
</button>
    )
}
{ //Burada buttonlarimiz icin genel bir componenet yaratiriz.State tutmasina gerek olmadigi icin functional component olustururuz
}