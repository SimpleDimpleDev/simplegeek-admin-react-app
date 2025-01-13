import { Check, Close } from "@mui/icons-material";
import { IconButton, MenuItem, Select } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";

type SelectConfirmProps<T extends string> = {
	options: Record<T, JSX.Element | string> | Map<T, JSX.Element | string>;
	defaultOption: T | undefined;
	onConfirm: (value: T) => void;
};

const SelectConfirm = <T extends string>({ options, defaultOption, onConfirm }: SelectConfirmProps<T>) => {
	const [selectedOption, setSelectedOption] = useState<T | "UNDEFINED">(defaultOption ?? "UNDEFINED");

	useEffect(() => setSelectedOption(defaultOption ?? "UNDEFINED"), [defaultOption]);

	const optionChanged = useMemo(() => selectedOption !== defaultOption, [selectedOption, defaultOption]);

	const handleConfirm = useCallback(() => {
		if (!defaultOption) return;
		if (selectedOption === "UNDEFINED") return;
		onConfirm(selectedOption);
	}, [defaultOption, selectedOption, onConfirm]);

	const handleCancel = useCallback(() => {
		if (!defaultOption) return;
		setSelectedOption(defaultOption);
	}, [defaultOption]);

    const renderOptions = useCallback(() => {
        if (options instanceof Map) {
            return Array.from(options.entries()).map(([key, value]) => (
                <MenuItem key={key} value={key}>
                    {value}
                </MenuItem>
            ));
        } else {
            return Object.keys(options).map((option) => (
                <MenuItem key={option} value={option}>
                    {options[option as T]}
                </MenuItem>
            ));
        }
    }, [options]);

	return (
		<div className="gap-2 ai-c d-f fd-r">
			<Select
				disabled={selectedOption === "UNDEFINED"}
				value={selectedOption}
				onChange={(e) => setSelectedOption(e.target.value as T)}
			>
				{selectedOption === "UNDEFINED" && <MenuItem value="UNDEFINED">Загрузка</MenuItem>}
				{renderOptions()}
			</Select>
			{selectedOption !== "UNDEFINED" && optionChanged && (
				<>
					<IconButton sx={{ color: "success.main" }} onClick={handleConfirm}>
						<Check />
					</IconButton>
					<IconButton sx={{ color: "error.main" }} onClick={handleCancel}>
						<Close />
					</IconButton>
				</>
			)}
		</div>
	);
};

export { SelectConfirm };
