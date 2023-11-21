class wordsAPI {
	async get(word) {
		const response = await fetch(`../api/bank.json`);
		const data = await response.json();
		for (const [i, w] of data.entries()) {
			if (w === word) {
				return { word: w };
			}
			if (i + 1 === data.length) {
				return {};
			}
		}
	}

	async getSolution(date) {
		const response = await fetch(
			`https://api-rewordle.noelpena.com/api/wordle`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ date }),
			}
		);

		// const response = await fetch(`../api/solutions.json`);
		const { data, error } = await response.json();

		if (!error) {
			console.log("test", data);
			return data;
		}
	}
}

export const http = new wordsAPI();
