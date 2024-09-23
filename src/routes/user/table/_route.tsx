import { Button, Typography } from "@mui/material";
import { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { useMemo, useState } from "react";

import AdminTable from "@routes/table";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { UserGet } from "@appTypes/User";
import { useGetUserListQuery } from "@api/admin/service";
import { useNavigate } from "react-router-dom";

const columns: GridColDef<UserGet>[] = [
	{ field: "email", headerName: "Email" },
	{ field: "createdAt", headerName: "Создан", type: "dateTime" },
	{ field: "updatedAt", headerName: "Обновлен", type: "dateTime" },
	{ field: "verified", headerName: "Подтвержден", type: "boolean" },
	{ field: "vkId", headerName: "Вконтакте", type: "boolean", valueGetter: (_value, row) => (row.vkId ? true : false) },
];

export default function UserTable() {
	const navigate = useNavigate();
	const { data: userList, isLoading: userListIsLoading } = useGetUserListQuery();
	const [selectedItemIds, setSelectedItemIds] = useState<GridRowSelectionModel>([]);

	const selectedUser = useMemo(() => {
		if (selectedItemIds.length !== 1) return null;
		const selectedItemId = selectedItemIds[0];
		return userList?.items.find((user) => user.id === selectedItemId) || null;
	}, [selectedItemIds, userList]);

	return (
		<div className="h-100v d-f fd-c px-3 pt-1 pb-4">
			<div className="d-f fd-r jc-sb p-2">
				<div>
					<Typography variant="h5">Пользователи</Typography>
					<Typography variant="body2" color="typography.secondary">
						Количество: {userList?.items.length}
					</Typography>
				</div>
			</div>
			<LoadingSpinner isLoading={userListIsLoading}>
				{!userList ? (
					<div className="w-100 h-100v d-f ai-c jc-c">
						<Typography variant="h5">Что-то пошло не так</Typography>
					</div>
				) : (
					<AdminTable
						columns={columns}
						data={userList.items}
						onRowSelect={setSelectedItemIds}
						selectedRows={selectedItemIds}
						leftHeaderButtons={
							<>
								<Button
									variant="contained"
									disabled={!selectedUser}
									onClick={() => navigate(`/user/inspect/${selectedUser?.id}`)}
								>
									Подробнее
								</Button>
								<Button
									variant="contained"
									disabled={!selectedUser}
									onClick={() => navigate(`/user/edit/${selectedUser?.id}`)}
								>
									Редактировать
								</Button>
							</>
						}
					/>
				)}
			</LoadingSpinner>
		</div>
	);
}
