const Modal = {
    open() {
        // abrir modal
        // adicionar a class active ao modal 
        document
            .querySelector('.modal-overlay')
            //adiciona class
            .classList
            .add('active')
    },
    close() {
        // fechar o modal
        // remover a class active do modal
        document
            .querySelector('.modal-overlay')
            //adiciona class
            .classList
            .remove('active')
    }
}

const Transaction = {
    all: [
        {
            id: 1,
            description: 'Despesa',
            amount: -10000,
            date: '23/01/2021'
        },
        {
            id: 2,
            description: 'Entrada',
            amount: 500,
            date: '23/01/2021'
        },
        {
            id: 3,
            description: 'Internet',
            amount: -200,
            date: '23/01/2021'
        }
    ],
    add(transaction) {
        Transaction.all.push(transaction)

        App.reload()
    },

    remove(index) {
        Transaction.all.splice(index, 1)

        App.reload()
    },

    incomes() {
        // somar as entradas

        let income = 0
        // arrou
        Transaction.all.forEach(transaction => {
            if(transaction.amount > 0) {
                income += transaction.amount
            }
        })
        return income

    },
    
    expenses() {
        // somar as saídas 

        let expense = 0
        // arrou
        Transaction.all.forEach(transaction => {
            if(transaction.amount < 0) {
                expense += transaction.amount
            }
        })
        return expense

    },

    total() {
        // entradas - saídas
        return Transaction.incomes() + Transaction.expenses()

    }
}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),
    addTransaction(transaction, index) {
        // cria elemento tag tr
        const tr = document.createElement('tr')
        // colocando o html dentro do tr
        tr.innerHTML = DOM.innerHTMLTransaction(transaction)

        DOM.transactionsContainer.appendChild(tr)
    },
    
    innerHTMLTransaction(transaction) {
        const CSSclass = transaction.amount > 0 ? 'income' : 'expense'

        const amount = Utils.formatCurrency(transaction.amount)

        // `` interpolação
        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img src="./assets/minus.svg" alt="Remover transação">
            </td>
        `

        return html
    },

    updateBalance() {
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())
        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())
        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ''
    }
}

const Utils = {
    formatCurrency(value) {
        // transformando em número
        const signal = Number(value) < 0 ? '-' : ''
        // replace - troca um caracter por outro '0', 'E' 0 por E 
        // \D - ache tudo que não é número
        // g - global
        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return signal + value
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    formatData() {
    },

    validateFields() {
        const {description, amount, date} = Form.getValues()

        // trim faz limpeza de espaços vazios
        if( description.trim() === "" || 
            amount.trim() === "" || 
            date.trim() === "") {
                throw new Error("Por favor, preencha todos os campos")
            }
    },

    submit(event) {
        // interrompendo o comportamento padrão
        event.preventDefault()

        Form.validateFields()
        Form.formatData()
    }
}

const App = {
    init() {
        // para cada elemento irá executar uma funcionalidade
        Transaction.all.forEach(transaction => {
            DOM.addTransaction(transaction)
        }) 

        DOM.updateBalance()

    },

    reload() {
        DOM.clearTransactions()
        App.init()
    }
}

App.init()