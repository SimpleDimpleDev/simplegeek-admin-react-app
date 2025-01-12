import { Box, Button, IconButton, Modal, Typography } from "@mui/material";
import { Close, Download } from "@mui/icons-material";

import Dropzone from "react-dropzone";
import { useState } from "react";

const templateDownloadLink =
	"https://downloadscdn6.freepik.com/187299/40/39890.jpg?filename=link-icon-left-side-with-white-backround.jpg&token=exp=1736684039~hmac=0fb936aa366d41becf0e16f6b3a8d550&filename=39890.jpg";

type ExcelUploadModalProps = {
	open: boolean;
	onClose: () => void;
	onSubmit: (data: FormData) => void;
};

const ExcelUploadModal: React.FC<ExcelUploadModalProps> = ({ open, onClose, onSubmit }) => {
	const [file, setFile] = useState<File | null>(null);

	const handleClose = () => {
		setFile(null);
		onClose();
	};

	const handleSubmit = () => {
		if (!file) return;
		const formData = new FormData();
		formData.append("file", file);
		onSubmit(formData);
	};

	return (
		<>
			<Modal open={open} onClose={handleClose} keepMounted={false}>
				<div className="w-100v h-100v ai-c d-f jc-c">
					<div className="section" style={{ width: 600, position: "relative" }}>
						<IconButton onClick={handleClose} style={{ position: "absolute", top: 16, right: 16 }}>
							<Close />
						</IconButton>
						<div className="w-100 ai-c d-f jc-c">
							<Typography variant="h5">Загрузить данные из Excel</Typography>
						</div>
						<div className="gap-2 w-100 ai-c d-f jc-c">
							<Typography variant="h6">Скачать шаблон</Typography>
							<a href={templateDownloadLink}>
								<IconButton>
									<Download />
								</IconButton>
							</a>
						</div>
						<Dropzone
							accept={{
								"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xls", ".xlsx"],
							}}
							multiple={false}
							onDropAccepted={(files) => {
								if (files.length === 0) return;
								if (files.length > 1) {
									return;
								}
								setFile(files[0]);
							}}
						>
							{({ getRootProps, getInputProps }) => (
								<Box
									sx={{ border: "1px dashed" }}
									{...getRootProps()}
									className="py-5 ai-c br-2 d-f fd-c jc-sb"
								>
									<input {...getInputProps()}></input>
									<div className="gap-2 d-f fd-c">
										<Typography variant="subtitle0" sx={{ color: "typography.secondary" }}>
											Перетащите сюда excel файл
										</Typography>
										<Button variant="contained">Выберите файл</Button>
									</div>
								</Box>
							)}
						</Dropzone>

						<div className="pl-1 d-f fd-r jc-sb">
							{file ? (
								<Typography variant="body1">{file.name}</Typography>
							) : (
								<Typography variant="body1">Файл не выбран</Typography>
							)}
							<Button disabled={!file} variant="contained" onClick={handleSubmit}>
								Загрузить
							</Button>
						</div>
					</div>
				</div>
			</Modal>
		</>
	);
};

export { ExcelUploadModal };
