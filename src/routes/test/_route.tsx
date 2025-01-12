import { Button } from "@mui/material";
import { ExcelUploadModal } from "@routes/publication/table/ExcelUpload";
import { useState } from "react";

export default function TestRoute() {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Button variant="contained" onClick={() => setOpen(true)}>
				open
			</Button>	
			<ExcelUploadModal open={open} onClose={() => setOpen(false)} onSubmit={(data) => console.log(data)} />
		</>
	);
}
