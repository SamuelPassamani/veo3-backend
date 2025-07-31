// src/types.ts

// --- Tipos para a Rota de Geração ---

export class GenerateVideo {
	// O roteador espera um corpo JSON, mas não validaremos a estrutura
	// interna por enquanto, aceitando qualquer objeto.
	constructor() {
		super();
	}
}

export class GenerateVideoResponse {
	// Define a estrutura da resposta que enviamos de volta.
	name: string;
	metadata: object;

	constructor(data: any) {
		super(data);
		this.name = data.name;
		this.metadata = data.metadata;
	}
}

// --- Tipos para a Rota de Verificação de Status ---

export class CheckStatus {
	// Parâmetros da URL
	operationName: string;

	constructor(data: any) {
		super(data);
		this.operationName = data.operationName;
	}
}

export class CheckStatusResponse {
	// Define a estrutura da resposta de status.
	done: boolean;
	response?: object;
	error?: object;

	constructor(data: any) {
		super(data);
		this.done = data.done;
		this.response = data.response;
		this.error = data.error;
	}
}

// --- Tipo de Erro Genérico ---
export class ErrorResponse {
	error: string;
	status: number;

	constructor(message: string, status: number = 500) {
		super({ error: message, status });
		this.error = message;
		this.status = status;
	}
}