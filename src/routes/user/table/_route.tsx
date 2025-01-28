import { Button, Typography } from "@mui/material";
import { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { useMemo, useState } from "react";

import Fader from "@components/Fader";
import { LoadingSpinner } from "@components/LoadingSpinner";
import ManagementTable from "@components/ManagementTable";
import { UserGet } from "@appTypes/User";
import { useGetUserListQuery } from "@api/admin/user";
import { useNavigate } from "react-router-dom";
import { userRoleTitles } from "src/constants";

const columns: GridColDef<UserGet>[] = [
	{ field: "role", headerName: "Роль", display: "flex", valueGetter: (_, row) => userRoleTitles.get(row.role) },
	{
		field: "isActive",
		headerName: "Активен",
		display: "flex",
		type: "boolean",
		valueGetter: (_, row) => row.state === "active",
	},
	{ field: "email", headerName: "Email", display: "flex" },
	{ field: "createdAt", headerName: "Создан", display: "flex", type: "dateTime" },
	{ field: "updatedAt", headerName: "Обновлен", display: "flex", type: "dateTime" },
	{ field: "verified", headerName: "Подтвержден", display: "flex", type: "boolean" },
	{
		field: "vkId",
		headerName: "Вконтакте",
		display: "flex",
		type: "boolean",
		valueGetter: (_value, row) => (row.vkId ? true : false),
	},
];

export default function UserTableRoute() {
	const navigate = useNavigate();
	const { data: userList, isLoading: userListIsLoading } = useGetUserListQuery();
	const [selectedItemIds, setSelectedItemIds] = useState<GridRowSelectionModel>([]);

	const selectedUser = useMemo(() => {
		if (selectedItemIds.length !== 1) return null;
		const selectedItemId = selectedItemIds[0];
		return userList?.items.find((user) => user.id === selectedItemId) || null;
	}, [selectedItemIds, userList]);

	return (
		<div className="px-3 pt-1 pb-4 h-100v d-f fd-c">
			<div className="p-2 d-f fd-r jc-sb">
				<div>
					<Typography variant="h5">Пользователи</Typography>
					<Typography variant="body2" color="typography.secondary">
						Количество: {userList?.items.length}
					</Typography>
				</div>
			</div>
			<LoadingSpinner isLoading={userListIsLoading}>
				{!userList ? (
					<div className="w-100 h-100v ai-c d-f jc-c">
						<Typography variant="h5">Что-то пошло не так</Typography>
					</div>
				) : (
					<Fader>
						<ManagementTable
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
								</>
							}
						/>
					</Fader>
				)}
			</LoadingSpinner>
		</div>
	);
}
