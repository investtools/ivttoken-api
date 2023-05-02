export class Translate {
    private readonly locale: string

    constructor(locale: string) {
        this.locale = locale
    }

    public t(string: string) {
        if (this.locale === "pt-br") {
            switch (string) {
                case "-": return "-"
                case "": return ""
                case "null": return "-"
                case "Loading": return "Carregando"
                case "Year": return "Ano"

                // register context
                case "Go to Sign-Up": return "Ir Para o Cadastro"
                case "Select Your Role": return "Selecione Sua Posição"
                case "Sign-Up": return "Cadastre-se"
                case "Register Your Credentials": return "Registre Suas Credenciais"
                case "Company Name": return "Nome da Empresa"
                case "Register Provider": return "Cadastrar Provedor"
                case "Register School Admin": return "Cadastrar Admin Escolar"
                case "Register Admin": return "Cadastrar Admin"
                case "Register Internet Provider": return "Cadastrar Provedor"
                case "School's CNPJ": return "CNPJ da Escola"
                case "Select Your Team": return "Selecione Sua Entidade"

                // isp context 
                case "Giga Token - PROVIDER": return "Giga Token - PROVEDOR"
                case "Benefits": return "Benefícios"
                case "Benefit": return "Benefício"
                case "My Contracts": return "Meus Contratos"
                case "My Information": return "Minhas Informações"
                case "Balance": return "Saldo"
                case "Token Amount": return "Total de Tokens"
                case "Unlocked Tokens": return "Tokens Desbloqueados"
                case "Locked Tokens": return "Tokens Bloqueados"
                case "Spent Tokens": return "Tokens Gastos"
                case "Tokens History": return "Histórico de Tokens"
                case "Select a School": return "Selecione Uma Escola"
                case "Selected School": return "Escola Selecionada"
                case "See Contract": return "Ver Contrato"
                case "Price": return "Preço"
                case "Date": return "Data"
                case "Transaction": return "Transação"
                case "Transactions": return "Transações"
                case "History": return "Histórico"
                case "Exchange": return "Trocar"
                case "Tax Break": return "Incentivo Fiscal"
                case "Send Contract": return "Enviar Contrato"
                case "My Schools": return "Minhas Escolas"
                case "Proceed with contract": return "Continuar com o contrato"

                // admin context
                case "Create School": return "Criar Escola"
                case "School Catalog": return "Catálogo de Escolas"
                case "Assign Tokens to School": return "Atribuir Tokens à Escola"
                case "Contracts": return "Contratos"
                case "Contract": return "Contrato"
                case "Unlock ISP Tokens": return "Desbloquear Tokens"
                case "Authorize User": return "Autorizar Usuário"
                case "Authorized Users": return "Usuários Autorizados"
                case "Authorized By": return "Autorizado Por"
                case "Authorized At": return "Data da Autorização"
                case "Select an Administrator": return "Selecione um Administrador"
                case "School's Name": return "Nome da Escola"
                case "Schools": return "Escolas"
                case "School": return "Escola"
                case "Internet Provider": return "Provedor"
                case "Created At": return "Data de Criação"
                case "Create New School": return "Criar Nova Escola"
                case "Reviewed By": return "Revisado Por"
                case "Reviewed At": return "Data de Revisão"
                case "Reviewer Team": return "Entidade"
                case "Pending Contracts": return "Contratos Pendentes"
                case "Approve": return "Aprovar"
                case "Deny": return "Negar"
                case "Assign Tokens": return "Atribuir Tokens"
                case "Schools Without Tokens": return "Escolas Sem Tokens"
                case "Selected School": return "Escola Selecionada"
                case "Select": return "Selecionar"
                case "Assign": return "Atribuir"
                case "Credentials": return "Credenciais"
                case "Role": return "Posição"
                case "Government": return "Governo"
                case "Team": return "Entidade"
                case "Number": return "Número"
                case "Internet Service Provider": return "Provedor de Internet"
                case "School Administrator": return "Administrador Escolar"

                // school admin context
                case "My School": return "Minha Escola"
                case "Connectivity Report": return "Relatório de Conectividade"
                case "School Details": return "Detalhes da Escola"
                case "Connectivity Reports": return "Relatórios de Conectividade"
                case "Connectivity Chart": return "Gráfico de Conectividade"
                case "Giga Token - SCHOOL": return "Giga Token - ESCOLA"
                case "Got it!": return "Entendi!"
                case "Follow Us!": return "Siga a InvestTools!"
                case "Send Report": return "Enviar Relatório"
                case "Report Connection": return "Reportar Conexão"
                case "Days Without Internet": return "Dias Sem Internet"
                case "Average Speed Mb/s": return "Velocidade Média Mb/s"
                case "Connection Quality": return "Qualidade da Conexão"
                case "Report": return "Relatório"
                case "Connectivity Percentage": return "Conectividade"
                case "No Reports Available": return "Nenhum relatório disponível"
                case "Name": return "Nome"
                case "State": return "Estado"
                case "Municipality": return "Município"
                case "City": return "Cidade"
                case "Zip Code": return "Cep"
                case "Address": return "Endereço"
                case "Cnpj": return "CNPJ"
                case "Inep Code": return "Código Inep"
                case "Administrator": return "Administrador"
                case "E-Mail": return "E-Mail"
                case "Tokens": return "Tokens"
                case "Provider": return "Provedor"
                case "Reports": return "Relatórios"
                case "See Reports": return "Ver Relatórios"

                // contract status
                case "Pending": return "Pendente"
                case "Approved": return "Aprovado"
                case "Denied": return "Negado"

                // wrong user role modal
                case "Sorry, you do not have the necessary permissions to register with the selected role.": return "Desculpe, você não possui as permissões necessárias para se registrar com a posição selecionada."
                case "Please contact the administrator for more information.": return "Por favor, entre em contato com um administrador para obter mais informações."

                // approve contract modal
                case "Contract Approved!": return "Contrato Aprovado!"
                case "This contract has been approved.": return "Este contrato foi aprovado."

                // deny contract modal
                case "Contract Denied!": return "Contrato Negado!"
                case "This contract has been denied.": return "Este contrato foi negado."

                // invalid email modal
                case "Oops! Invalid e-mail address :(": return "Opa! Endereço de e-mail inválido :("
                case "Please enter a valid e-mail address and try again.": return "Por favor, insira um endereço de e-mail válido e tente novamente."

                // incomplete fields modal
                case "Oops! We couldn't submit your responses :(": return "Opa! Não foi possível enviar suas respostas :("
                case "You didn't fill out all the fields before submitting.": return "Você não preencheu todos os campos antes de enviar."
                case "Please fill out all fields and try again!": return "Por favor, preencha todos os campos e tente novamente!"

                // error message
                case "Oops! Something went wrong :(": return "Opa! Infelizmente algo deu errado :("
                case "We could not access the data you were looking for.": return "Não foi possível acessar os dados que você estava procurando."

                // form sent modal
                case "Responses successfully submitted!": return "Respostas enviadas com sucesso!"
                case "We have received the submitted data and are processing it.": return "Recebemos os dados enviados e estamos processando."
                case "Thank you very much! :)": return "Muito obrigado! :)"

                // giga token title
                case "Giga Token is a social impact project in partnership with UNICEF that aims to bridge the digital divide by connecting underprivileged schools to the internet.": return "Giga Token é um projeto de impacto social em parceria com a UNICEF que visa reduzir a divisão digital conectando escolas carentes à internet."
                case "The project uses a blockchain-based token, GigaToken (GIGA), to incentivize internet service providers (ISPs) to connect schools to the internet.": return "O projeto utiliza um token baseado em blockchain, GigaToken (GIGA), para incentivar provedores de serviços de internet (ISPs) a conectar as escolas à internet."
                case "ISPs can earn GigaTokens by connecting schools to the internet and ensuring the quality of the connection.": return "Os ISPs podem ganhar GigaTokens conectando escolas à internet e garantindo a qualidade da conexão."
                case "These tokens can then be exchanged for tax incentives or other rewards.": return "Esses tokens podem ser trocados por incentivos fiscais ou outras recompensas."
                case "The project is designed to improve educational opportunities for underprivileged students by providing access to online resources and promoting digital inclusion.": return "O projeto é pensado para melhorar as oportunidades educacionais para estudantes carentes, fornecendo acesso a recursos on-line e promovendo a inclusão digital."

                // not enough tokens modal
                case "You do not have enough tokens to execute this transaction.": return "Você não tem tokens suficientes para executar esta transação."
                case "Please try again when you have enough tokens to exchange for this benefit.": return "Por favor, tente novamente quando tiver tokens suficientes para trocar por este benefício."

                // no contract modal
                case "Oops! There are no pending contracts...": return "Opa! Não há contratos pendentes..."
                case "There are currently no pending contracts to review.": return "Atualmente não há contratos pendentes para revisar."
                case "Please check back later!": return "Por favor, verifique novamente mais tarde!"

                // add number modal
                case "Don't forget to add the number to the address field.": return "Não esqueça de adicionar o número no campo de endereço."
                case "After the address autocomplete, you need to add the number.": return "Depois do preenchimento automático do endereço, é necessário adicionar o número."
                case "Add the number and create the school.": return "Adicione o número e crie a escola."

                // confirm purchase modal
                case "Are you sure you want to proceed?": return "Tem certeza que deseja prosseguir?"
                case "Proceed with exchange": return "Continuar com a troca"
                case "Cancel": return "Cancelar"

                // purchased benefit modal
                case "Benefit successfully purchased!": return "Benefício adquirido com sucesso!"
                case "We have received your exchange and are processing it.": return "Recebemos sua troca e estamos processando."
                case "Thank you very much! :)": return "Muito obrigado! :)"

                // contract send modal
                case "Contract successfully sent!": return "Contrato enviado com sucesso!"
                case "We have sent your contract for review.": return "Enviamos seu contrato para avaliação."
                case "One of the administrators will review it shortly.": return "Em breve um dos administradores irá revisá-lo."
                case "Check the status of your contract in the 'My Contracts' menu.": return "Fique atento ao status do seu contrato no menu 'Meus Contratos'."

                // no schools isp modal
                case "Oops! It seems like you don't have any contracts with schools yet :(": return "Ops! Parece que você ainda não possui nenhum contrato com escolas."
                case "In order to access the school reports, you need to have at least one active contract.": return "Para ter acesso aos relatórios das escolas, você precisa ter pelo menos um contrato ativo."
                case "Please select one school to send a contract.": return "Por favor, selecione uma escola para enviar um contrato."

                // school has no provider modal
                case "Sorry, you cannot submit a connectivity report as your school has no internet provider yet.": return "Desculpe, você não pode enviar um relatório de conectividade pois a sua escola ainda não tem nenhum provedor de internet."

                // duplicated report modal
                case "A connectivity report for this month has already been created.": return "Já foi criado um relatório de conectividade para este mês."
                case "Please select another month or contact the administrator for assistance.": return "Por favor, selecione outro mês ou entre em contato com o administrador para obter ajuda."

                // months
                case "Month": return "Mês"
                case "January": return "Janeiro"
                case "February": return "Fevereiro"
                case "March": return "Março"
                case "April": return "Abril"
                case "May": return "Maio"
                case "June": return "Junho"
                case "July": return "Julho"
                case "August": return "Agosto"
                case "September": return "Setembro"
                case "October": return "Outubro"
                case "November": return "Novembro"
                case "December": return "Dezembro"

                // connection quality
                case "Select connection quality": return "Selecione a qualidade da conexão"
                case "Low": return "Baixa"
                case "Medium": return "Mediana"
                case "High": return "Alta"

                default: return string
            }
        } else return string
    }
}