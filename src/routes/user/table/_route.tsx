import { Button, Typography } from "@mui/material";
import { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";

import { Add } from "@mui/icons-material";
import AdminTable from "@routes/table";
import { UserAdmin } from "@appTypes/User";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const columns: GridColDef[] = [
	{
		field: "email",
		headerName: "Email",
	},
	{ field: "createdAt", headerName: "Создан", type: "dateTime" },
	{ field: "updatedAt", headerName: "Обновлен", type: "dateTime" },
];

export default function UserTable() {
	const navigate = useNavigate();
	const users = [] as UserAdmin[];
	const [selectedUserIds, setSelectedUserIds] = useState<GridRowSelectionModel>([]);

	return (
		<div className="h-100v d-f fd-c px-3 pt-1 pb-4">
			<div className="d-f fd-r jc-sb p-2">
				<div>
					<Typography variant="h5">Пользователи</Typography>
					<Typography variant="body2" color="typography.secondary">
						Количество: {users.length}
					</Typography>
				</div>
				<Button variant="contained" onClick={() => navigate("/product/create")}>
					<Add />
					Добавить товар
				</Button>
			</div>

			<AdminTable
				columns={columns}
				data={users}
				onRowSelect={setSelectedUserIds}
				selectedRows={selectedUserIds}
				headerButtons={
					<>
						<Button
							variant="contained"
							disabled={!selectedUserIds.length || selectedUserIds.length > 1}
							onClick={() => navigate(`/user/inspect/${selectedUserIds[0]}`)}
						>
							Подробнее
						</Button>
						<Button
							variant="contained"
							disabled={!selectedUserIds.length || selectedUserIds.length > 1}
							onClick={() => navigate(`/user/edit/${selectedUserIds[0]}`)}
						>
							Редактировать
						</Button>
					</>
				}
			/>
		</div>
	);
}
