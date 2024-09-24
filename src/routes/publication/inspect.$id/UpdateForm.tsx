import { Button, TextField } from "@mui/material";

import { PublicationGet } from "@appTypes/Publication";
import { PublicationUpdateSchema } from "@schemas/Publication";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type PublicationUpdateFormData = {
	id: string;
	link: string;
};

const PublicationUpdateResolver = z.object({
	id: z.string().min(1),
	link: z.string().min(1, { message: "Укажите ссылку" }),
});

interface PublicationUpdateFormProps {
	publication: PublicationGet;
	onSubmit: (data: z.infer<typeof PublicationUpdateSchema>) => void;
}

export const PublicationUpdateForm: React.FC<PublicationUpdateFormProps> = ({ publication, onSubmit }) => {
	const resolvedOnSubmit = (data: PublicationUpdateFormData) => {
		onSubmit(PublicationUpdateSchema.parse(data));
	};

	const defaultValues = {
		id: publication.id,
		link: publication.link,
	};

	const { register, handleSubmit } = useForm<PublicationUpdateFormData>({
		resolver: zodResolver(PublicationUpdateResolver),
		defaultValues,
	});

	return (
		<form className="h-100 d-f fd-c jc-sb px-2 pt-2 pb-4" onSubmit={handleSubmit(resolvedOnSubmit)}>
			<div className="d-f fd-c gap-1">
				<input type="hidden" {...register("id")} />
				<TextField label="Ссылка" variant="outlined" fullWidth {...register("link")} />
			</div>
			<Button type="submit">Сохранить</Button>
		</form>
	);
};
