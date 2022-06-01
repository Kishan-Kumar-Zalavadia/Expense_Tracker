import React, { Component } from 'react';
import './Tracker.css';
import fire from '../../config/Fire';
import Transaction from './Transaction/Transaction';
//const time = new Date().toLocaleTimeString();
const current = new Date();
const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;

var showDate=new Date();
var dt = showDate.toDateString();
var time = ((showDate.getHours()<10?'0':'') + showDate.getHours())+':'+((showDate.getMinutes()<10?'0':'') + showDate.getMinutes())+' '+ (showDate.getHours>=12?'pm':'am');
class Tracker extends Component {

    state = {
        transactions: [],
        money: 0,
        transactionName: '',
        transactionType: '',
        price: '',
        time: time,
        date, date,
        currentUID: fire.auth().currentUser.uid
    }
    // logout function
    logout = () => {
        fire.auth().signOut();
    }

    handleChange = input => e => {
        this.setState({
            [input]: e.target.value !=="0" ? e.target.value : ""
        });
    }

    // add transaction
    addNewTransaction = () => {
        const {transactionName, transactionType, price, time, date, currentUID, money} = this.state;

        // validation
        if(transactionName && transactionType && price){

            const BackUpState = this.state.transactions;
            BackUpState.push({
                id: BackUpState.length + 1,
                name: transactionName,
                type: transactionType,
                price: price,
                time: time,
                date: date,
                user_id: currentUID
            });
            
            fire.database().ref('Transactions/' + currentUID).push({
                id: BackUpState.length,
                name: transactionName,
                type: transactionType,
                price: price,
                time: time,
                date, date,
                user_id: currentUID
            }).then((data) => {
                //success callback
                console.log('success callback');
                this.setState({
                    transactions: BackUpState,
                    money: transactionType === 'deposit' ? money + parseFloat(price) : money - parseFloat(price),
                    transactionName: '',
                    transactionType: '',
                    price: '',
                    time: time,
                    date: date
                })
            }).catch((error)=>{
                //error callback
                console.log('error ' , error)
            });

        }
    }

    componentWillMount(){
        const {currentUID, money} = this.state;
        let totalMoney = money;
        const BackUpState = this.state.transactions;
        fire.database().ref('Transactions/' + currentUID).once('value',
        (snapshot) => {
            // console.log(snapshot);
            snapshot.forEach((childSnapshot) => {

                totalMoney = 
                    childSnapshot.val().type === 'deposit' ? 
                    parseFloat(childSnapshot.val().price) + totalMoney
                    : totalMoney - parseFloat(childSnapshot.val().price);
                
                BackUpState.push({
                    id: childSnapshot.val().id,
                    name: childSnapshot.val().name,
                    type: childSnapshot.val().type,
                    time: childSnapshot.val().time,
                    date: childSnapshot.val().date,
                    price: childSnapshot.val().price,
                    user_id: childSnapshot.val().user_id
                });
                // console.log(childSnapshot.val().name);
            });
            this.setState({
                transactions: BackUpState,
                money: totalMoney
            });
        });
    }

    render(){
        var currentUser = fire.auth().currentUser;
        return(
            <div className="trackerBlock">
                <div className="welcome">
                    <span>Hi, {currentUser.displayName}!</span>
                    <button className="exit" onClick={this.logout}>Logout</button>
                </div>
                <div className="totalMoney">${this.state.money}</div>

                <div className="newTransactionBlock">
                    <div className="newTransaction">
                        <form>
                            <input
                                onChange={this.handleChange('transactionName')}
                                value={this.state.transactionName}
                                placeholder="Transaction Name"
                                type="text"
                                name="transactionName"
                                className='transactionName'
                            />
                            <div className="inputGroup">
                                <select name="type"
                                    onChange={this.handleChange('transactionType')}
                                    value={this.state.transactionType}>
                                    <option value="0" className='default'>Type</option>
                                    <option className='expense' value="expense">Expense</option>
                                    <option className='deposit' value="deposit">Deposit</option>
                                </select>
                                <input
                                    onChange={this.handleChange('price')}
                                    value={this.state.price}
                                    placeholder="Price"
                                    type="number"
                                    name="price"
                                />
                            </div>
                        </form>
                        <button onClick={() => this.addNewTransaction()} className="addTransaction">Add Transaction</button>
                    </div>
                </div>
                
                <div className="latestTransactions">
                    <p>Transactions</p>
                    <ul>
                        {
                            Object.keys(this.state.transactions).map((id) => (
                                <Transaction key={id}
                                    type={this.state.transactions[id].type}
                                    name={this.state.transactions[id].name}
                                    price={this.state.transactions[id].price}
                                    time={this.state.transactions[id].time}
                                    date={this.state.transactions[id].date}
                                />
                            )).reverse()
                        }
                    </ul>
                </div>
            </div>
        );
    }
}

export default Tracker;