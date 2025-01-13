import { Check, Close } from "@mui/icons-material";
import { IconButton, MenuItem, Select } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";

type SelectConfirmProps<T extends string> = {
	options:
		| Record<T, JSX.Element | string>
		| Map<T, JSX.Element | string>
		| { value: T; label: JSX.Element | string }[];
	defaultOption: T | undefined;
	onConfirm: (value: T) => void;
};

/**
 * A select component that allows the user to change the selected option and confirm the new value,
 * or cancel and revert to the default option.
 *
 * @param {object} props The component props.
 * @param {Record<T,JSX.Element|string>|Map<T,JSX.Element|string>|{value:T;label:JSX.Element|string}[]} props.options
 *  The options to display in the select. Can be an object with string keys and values, a Map of strings to JSX elements or strings, or an array of objects with "value" and "label" properties.
 * @param {T|undefined} props.defaultOption The default option to select when the component renders. If not provided, the component will render with no option selected.
 * @param {function(T):void} props.onConfirm The function to call when the user confirms a new option.
 * @returns {JSX.Element} The select component with confirm and cancel buttons.
 */
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
		} else if (Array.isArray(options)) {
			return options.map((option) => (
				<MenuItem key={option.value} value={option.value}>
					{option.label}
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
		<div className="gap-1 ai-c d-f fd-r">
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
