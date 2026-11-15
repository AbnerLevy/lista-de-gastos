//seleciona os elementos do formulário
const form = document.querySelector('form');
const amount = document.getElementById('amount');
const expense = document.getElementById('expense');
const category = document.getElementById('category');

//selecionam os elementos da lista
const expenseList = document.querySelector('ul');
const expensesQuantity = document.querySelector('aside header p span');
const totalAmount = document.querySelector('aside header h2');

amount.oninput = function () {
    //pega o valor do input e remove qualquer caractere que não seja número
    let value = amount.value.replace(/\D/g, '');

    //transforma o valor em centavos
    value = Number(value) / 100;

    //formata o valor para moeda brasileira e atualiza o valor do input
    amount.value = formataMoeda(value);
}

function formataMoeda(value) {
    //formata o valor para moeda brasileira
    value = value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    return value;
}

//captura o evento de envio do formulário
form.onsubmit = (event) => {
    //previne o comportamento padrão do formulário de recarregar a página
    event.preventDefault();

    //cria um objeto com os dados do novo gasto
    const newExpense = {
        id: new Date().getTime(),
        amount: amount.value,
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        created_at: new Date()
    }
    //chama a função para adicionar o novo gasto
    addExpense(newExpense);
}

//função para adicionar o novo gasto na lista
function addExpense(newExpense) {
    try {
        //cria o elemento para adicionar na lista
        const expenseItem = document.createElement('li');
        expenseItem.classList.add('expense');

        // cria o icone da categoria com base no nome da categoria
        const expenseIcon = document.createElement('img');
        expenseIcon.setAttribute('src', `./img/${newExpense.category_id}.svg`);
        expenseIcon.setAttribute('alt', newExpense.category_name);

        // cria o elemento de texto com as informações do gasto
        const expenseInfo = document.createElement('div');
        expenseInfo.classList.add('expense-info');

        // cria o elemento de texto com o nome do gasto
        const expenseName = document.createElement('strong');
        expenseName.textContent = newExpense.expense;

        // cria a categoria do gasto
        const expenseCategory = document.createElement('span');
        expenseCategory.textContent = newExpense.category_name;

        // adiciona nome e categoria no elemento de informações
        expenseInfo.append(expenseName, expenseCategory);

        // cria o valor do gasto
        const expenseAmount = document.createElement('span');
        expenseAmount.classList.add('expense-amount');
        expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace('R$', '')}`;

        //cria o elemento de remover gasto
        const removeIcon = document.createElement('img');
        removeIcon.classList.add('remove-icon');
        removeIcon.setAttribute('src', './img/remove.svg');
        removeIcon.setAttribute('alt', 'remover');

        // adiciona as informações no item
        expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon);

        // adiciona o item na lista
        expenseList.append(expenseItem);
        
        //limpa os campos do formulário
        formClear();
        
        //atualiza o total de gastos
        updateTotal();

    } catch (error) {
        alert("Ocorreu um erro ao adicionar o gasto. Por favor, tente novamente.");
        console.log(error);
    }
}

//função para atualizar o total de gastos
function updateTotal() {
    try {
        // recupera todos os itens da lista de gastos
        const items = expenseList.children

        //atualiza a quantidade de itens na lista
        expensesQuantity.textContent = `${items.length} ${items.length > 1 ? 'despesas' : 'despesa'}`;

        //calcula o total de gastos
        let total = 0;
        for (let i = 0; i < items.length; i++) {
            const amount = items[i].querySelector('.expense-amount')

            //remove qualquer caractere que não seja número e substitui a vírgula por ponto
            let value = amount.textContent.replace(/[^\d,]/g, '').replace(',', '.');
            
            //converte o valor para float
            value = parseFloat(value);

            //verifica se o valor é um número válido    
            if (isNaN(value)) {
                return alert("Não foi possível calcular o total. O valor não é um número válido.");
            }
            total += Number(value);
        }

        //cria a span para adicionar o R$ formatado
        const symbolBRL = document.createElement('small');
        symbolBRL.textContent = 'R$';

        //formata e remove o valor que será exibido pela small com estilo customizado
        total = formataMoeda(total).toUpperCase().replace('R$', '');
        
        //limpao conteúdo do elemento
        totalAmount.innerHTML = '';

        //adiciona o R$ e o valor formatado no elemento
        totalAmount.append(symbolBRL, total);

    } catch (error) {
        alert("Ocorreu um erro ao atualizar o total. Por favor, tente novamente.");
        console.log(error);
    }
}

//captura o evento de clique no ícone de remover gasto
expenseList.addEventListener('click', function(event) {
    //verifica se o elemento clicado é o ícone de remover gasto
    if (event.target.classList.contains('remove-icon')) {
        //pega o elemento pai do ícone de remover gasto
        const item = event.target.parentElement;
        // remove o item da lista
        item.remove();
        // atualiza o total de gastos
        updateTotal();
    }    
})

//limpa os valores do formulário e volta o foco para o campo de despesa 
function formClear() {
    //reseta o valor dos inputs
    amount.value = '';
    category.value = '';
    expense.value = '';

    //coloca o foco no input de despesa
    expense.focus();
}
