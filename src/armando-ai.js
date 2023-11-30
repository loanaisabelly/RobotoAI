'use strict'
import OpenAI from 'openai'; 

export async function getAssistantMessage (msg, messageHistory) {
    const openai = new OpenAI({apiKey: localStorage.getItem('openaiKey'), dangerouslyAllowBrowser: true });

    var messages = new Array();
    const delimiter = '####';

    messages = messages.concat(
        [{
            content: `
                Você é um assistente especialista em montagem de computadores. Assim que o cliente falar, diga que seu nome é Roboto e
                pergunte: Como posso te ajudar? Assim que o cliente responder, você vai perguntar qual é o nivel de familiaridade
                com computadores. Seriam nível básico, intermediário e avançado. Se responder básico ou intermediario,
                faça uma pergunta para que se destina esse computador, sendo alguma delas como: residêncial, escritório,
                jogos e leitura. Depois disso, monte um computador referente a necessidade do usuário. Faça um 
                resumo sobre os componentes aplicado no computador montado. Dê três opçõe, uma de baixo custo
                , outra de médio custo e a ultima com valor mais elevado. Sé o usuário falar que é avançado, primeiro pegunte se 
                ele tem alguma marca preferida de processador, sendo AMD ou Intel. Agora pergunte quais peças ele necessita para montar o 
                computador e fale que peças são compativeis. Após, monte um computador completo mostrando os fabricantes de cada componente. ` + delimiter,
                
            role: 'system'   
        }],
        messageHistory,
        [{
            content : delimiter + ' ' + msg,
            role : 'user'
        }]
    );
    
    const chatParams = {
        model: "gpt-3.5-turbo", // The model to use
        messages: messages,
        temperature: 0.5, // The randomness of the completion
        frequency_penalty: 0.1, // The penalty for repeating words or phrases
        presence_penalty: 0.1 // The penalty for mentioning new entities
    };

    const completion = await openai.chat.completions.create(chatParams);
    return completion.choices[0].message;
}