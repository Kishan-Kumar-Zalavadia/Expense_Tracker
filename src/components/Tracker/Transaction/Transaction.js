import React from 'react';
import '../Tracker.css';

const Transaction = props => {
    return (
        <li>
            <div className='container'>
            <div className='name'>{props.name}</div>
            <div>{props.type === 'deposit' ? (
                <span className="deposit"> +{props.price} </span>
            ) : (
                <span className="expense">
                    -{props.price}
                </span>
            )}</div>
            <div>{props.time}</div>
            <div>{props.date}</div>
            </div>
        </li>
    );
}

export default Transaction;