export type ProdeMatchStatus =
	| "DRAFT"
	| "SCHEDULED"
	| "OPEN"
	| "CLOSED"
	| "RESULT_RECORDED"
	| "EVALUATED"
	| "CANCELLED";

export type ProdePredictionStatus = "PENDING" | "CORRECT" | "INCORRECT";

export type ProdePrediction = {
	id: string;
	match_id: string;
	argentina_goals: number;
	opponent_goals: number;
	status: ProdePredictionStatus;
	created_at: string;
	updated_at: string;
};

export type ProdeMatch = {
	id: string;
	stage: string;
	opponent: string;
	kickoff_at: string;
	cutoff_at: string;
	status: ProdeMatchStatus;
	is_open: boolean;
	argentina_goals: number | null;
	opponent_goals: number | null;
	my_prediction: ProdePrediction | null;
};
