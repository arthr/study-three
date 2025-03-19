/**
 * Gerencia o ciclo de tempo do jogo e notifica observadores sobre mudanças
 */
export class TimeManager {
	constructor() {
		this.time = 0; // Tempo em segundos
		this.dayDuration = 60 * 24; // Um dia completo em segundos
		this.timeScale = 1; // Multiplicador de velocidade do tempo
		this.listeners = [];

		// Variáveis calculadas
		this.dayTime = 0; // 0-1 representando o ciclo do dia
		this.season = 0; // 0-3 representando as estações
	}

	addListener(listener) {
		if (typeof listener.onTimeUpdate === "function") {
			console.log(`Adicionando listener ${listener.constructor.name}`);
			this.listeners.push(listener);
		} else {
			console.warn("Listener não implementa onTimeUpdate()");
		}
	}

	update(deltaTime) {
		this.time += deltaTime * this.timeScale;

		// Calcula o horário do dia (0-1)
		this.dayTime = (this.time % this.dayDuration) / this.dayDuration;

		// Temporada (ciclo mais longo)
		this.season = Math.floor((this.time / (this.dayDuration * 30)) % 4);

		// Notifica todos os listeners
		this.listeners.forEach((listener) => {
			listener.onTimeUpdate({
				totalTime: this.time,
				dayTime: this.dayTime,
				season: this.season,
				deltaTime: deltaTime * this.timeScale,
			});
		});
	}

	/**
	 * Retorna o horário do mundo em formato de relógio (hh:mm)
	 * @returns {string} Horário formatado
	 */
	getFormattedTime() {
		// Ajusta o dayTime para alinhar com a posição do sol:
		// - dayTime 0 = sol no leste (amanhecer) = 06:00
		// - dayTime 0.25 = sol no zênite (meio-dia) = 12:00
		// - dayTime 0.5 = sol no oeste (pôr do sol) = 18:00
		// - dayTime 0.75 = sol no nadir (meio da noite) = 00:00

		// Adiciona 0.25 (6 horas) ao dayTime e mantém no intervalo [0,1]
		const adjustedDayTime = (this.dayTime + 0.25) % 1.0;

		// Converte para horas (0-24)
		const totalHours = adjustedDayTime * 24;

		// Extrai horas e minutos
		const hours = Math.floor(totalHours);
		const minutes = Math.floor((totalHours - hours) * 60);

		// Formata com zeros à esquerda quando necessário
		const formattedHours = hours.toString().padStart(2, "0");
		const formattedMinutes = minutes.toString().padStart(2, "0");

		return `${formattedHours}:${formattedMinutes}`;
	}
}
