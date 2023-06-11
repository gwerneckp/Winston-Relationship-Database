export type Person = {
	id: string;
	name: string;
	grade: string;
	school: string;
	email: string;
	anonymous: boolean;
	gotWith: Person[];
	dated: Person[];
	dating: Person[];
};
