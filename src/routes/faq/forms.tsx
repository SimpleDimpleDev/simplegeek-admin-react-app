import { Button, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { FAQItemCreateSchema, FAQItemSchema } from "@schemas/FAQ";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export type FaqItemCreateFormData = z.infer<typeof FAQItemCreateSchema>;
export type FaqItemUpdateFormData = z.infer<typeof FAQItemSchema>;

export const FAQItemCreateForm = ({ onSubmit }: { onSubmit: (data: FaqItemCreateFormData) => void }) => {
    const { control, handleSubmit } = useForm<FaqItemCreateFormData>({ resolver: zodResolver(FAQItemCreateSchema) });
    return (
        <form className="h-100 d-f fd-c jc-sb px-2 pt-2 pb-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="d-f fd-c gap-1">
                <Controller
                    name="question"
                    control={control}
                    defaultValue={""}
                    render={({ field, fieldState }) => (
                        <TextField
                            {...field}
                            label="Вопрос"
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                            fullWidth
                        />
                    )}
                />

                <Controller
                    name="answer"
                    control={control}
                    defaultValue={""}
                    render={({ field, fieldState }) => (
                        <TextField
                            {...field}
                            label="Ответ"
                            multiline
                            rows={4}
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                            fullWidth
                        />
                    )}
                />
            </div>
            <Button type="submit" variant="contained">
                Сохранить
            </Button>
        </form>
    );
};

export const FAQItemUpdateForm = ({
    itemToUpdate,
    onSubmit,
}: {
    itemToUpdate: FaqItemUpdateFormData | undefined;
    onSubmit: (data: FaqItemUpdateFormData) => void;
}) => {
    const {
        control,
        handleSubmit,
        formState: { isDirty },
    } = useForm<FaqItemUpdateFormData>({ resolver: zodResolver(FAQItemSchema) });
    if (!itemToUpdate) { console.error("No faq item to update"); return null};
    return (
        <form className="h-100 d-f fd-c jc-sb px-2 pt-2 pb-4" onSubmit={handleSubmit(onSubmit)}>
            <input type="hidden" value={itemToUpdate.id} {...control.register("id")} />
            <div className="d-f fd-c gap-1">
                <Controller
                    name="question"
                    control={control}
                    defaultValue={itemToUpdate.question}
                    render={({ field, fieldState }) => (
                        <TextField
                            {...field}
                            label="Вопрос"
                            multiline
                            rows={4}
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                            fullWidth
                        />
                    )}
                />

                <Controller
                    name="answer"
                    control={control}
                    defaultValue={itemToUpdate.answer}
                    render={({ field, fieldState }) => (
                        <TextField
                            {...field}
                            label="Ответ"
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                            fullWidth
                        />
                    )}
                />
            </div>
            <Button disabled={!isDirty} type="submit" variant="contained">
                Сохранить
            </Button>
        </form>
    );
};
