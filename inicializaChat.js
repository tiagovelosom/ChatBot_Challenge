import dotenv from "dotenv";

import { GoogleGenerativeAI, FunctionDeclarationSchemaType } from '@google/generative-ai';

dotenv.config();

const genAI = new GoogleGenerativeAI("AIzaSyDgDh4oTw0j-1iiEAMSRG8Fefh-DGZ0m6Q");

const funcoes = {
  taxaJurosParcelamento: ({ value }) => {
    const meses = typeof value === "string" ? parseInt(value) : value;
    if (meses <= 6) {
      return 3;
    } else if (meses <= 12) {
      return 5;
    } else if (meses <= 24) {
      return 7;
    }
  }
};

const tools = [
  {
    functionDeclarations: [
      {
        name: "taxaJurosParcelamento",
        description: "Retorna a taxa de juros para parcelamento baseado na quantidade de meses",
        parameters: {
          type: FunctionDeclarationSchemaType.OBJECT,
          properties: {
            value: { type: FunctionDeclarationSchemaType.NUMBER },
          },
          required: ["value"],
        } 
      }
    ]
  }
];


const model = genAI.getGenerativeModel(
  { model: "gemini-1.0-pro", tools},
  { apiVersion: "v1beta"});

let chat;

function inicializaChat() {
  chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: `Você é shape, um chatbot amigável que representa a empresa softtek, voce vai ajudar em todas as duvidas que o pessoal vai tirar com voce sobre os problemas que eles tiverem. Você pode responder mensagens que tenham relação com todos os problemas que as pessoas tiverem.` }],
      },
      {
        role: "model",
        parts: [{ text: `Olá! Obrigado por entrar em contato com a softtek. Antes de começar a responder sobre suas dúvidas, preciso do seu nome e endereço de e-mail.` }],
      },
    ],
    generationConfig: {
      maxOutputTokens: 1000,
    },
  });
}

export { chat, funcoes, inicializaChat}