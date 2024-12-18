import { Button, CircularProgress, IconButton, Modal, Tooltip, Typography } from "@mui/material";
import { Check, Close, OpenInNew } from "@mui/icons-material";
import { Suspense, useCallback, useState } from "react";
import {
	downloadCDEKWaybillPrint,
	useCreateCDEKWaybillMutation,
	useCreateCDEKWaybillPrintMutation,
	useGetCDEKWaybillQuery,
} from "@api/admin/cdek";

import CDEKWaybillCreateForm from "./CDEKWaybillCreateForm";
import { LoadingOverlay } from "@components/LoadingOverlay";
import { OrderDeliveryGetSchema } from "@schemas/Order";
import { useMutationFeedback } from "@hooks/useMutationFeedback";
import { z } from "zod";

interface OrderCDEKSectionProps {
	order: {
		id: string;
		delivery: z.infer<typeof OrderDeliveryGetSchema>;
	};
	feedbackFn: (message: string) => void;
}

const OrderCDEKSection: React.FC<OrderCDEKSectionProps> = ({ order, feedbackFn }) => {
	const { data: CDEKWaybill, isLoading: CDEKWaybillIsLoading } = useGetCDEKWaybillQuery(
		{
			deliveryId: order.delivery.id,
		},
		{ pollingInterval: 5000 }
	);

	const [
		createCDEKWaybill,
		{
			isLoading: createCDEKWaybillIsLoading,
			isSuccess: createCDEKWaybillIsSuccess,
			isError: createCDEKWaybillIsError,
			error: createCDEKWaybillError,
		},
	] = useCreateCDEKWaybillMutation();

	const [
		createCDEKWaybillPrint,
		{
			isLoading: createCDEKWaybillPrintIsLoading,
			isSuccess: createCDEKWaybillPrintIsSuccess,
			isError: createCDEKWaybillPrintIsError,
			error: createCDEKWaybillPrintError,
		},
	] = useCreateCDEKWaybillPrintMutation();

	const [waybillCreateModalOpened, setWaybillCreateModalOpened] = useState(false);

	const handleCreateCDEKWaybillPrint = useCallback(() => {
		createCDEKWaybillPrint({ orderId: order.id, deliveryId: order.delivery.id });
	}, [order, createCDEKWaybillPrint]);

	const handleOpenWaybillPrint = useCallback(async () => {
		if (!order.delivery) return;
		const CDEKWaybillPrint = await downloadCDEKWaybillPrint({ orderId: order.id, deliveryId: order.delivery.id });
		const blobUrl = URL.createObjectURL(CDEKWaybillPrint);
		window.open(blobUrl);
	}, [order]);

	const handleOpenCDEKTracking = useCallback(() => {
		if (!CDEKWaybill?.tracking) return;
		window.open(CDEKWaybill.tracking.link, "_blank");
	}, [CDEKWaybill]);

	const handleOpenCDEKOrder = useCallback(() => {
		if (!CDEKWaybill?.tracking) return;
		window.open(`https://lk.cdek.ru/order-history/${CDEKWaybill.tracking.code}/view`, "_blank");
	}, [CDEKWaybill]);

	useMutationFeedback({
		title: "Запрос на создание накладной",
		isSuccess: createCDEKWaybillIsSuccess,
		isError: createCDEKWaybillIsError,
		error: createCDEKWaybillError,
		feedbackFn,
		successAction: () => {
			setWaybillCreateModalOpened(false);
		},
	});

	useMutationFeedback({
		title: "Запрос на создание распечатки накладной",
		isSuccess: createCDEKWaybillPrintIsSuccess,
		isError: createCDEKWaybillPrintIsError,
		error: createCDEKWaybillPrintError,
		feedbackFn,
	});

	const showLoadingOverlay = createCDEKWaybillIsLoading || createCDEKWaybillPrintIsLoading;

	return (
		<>
			<Modal open={waybillCreateModalOpened} onClose={() => setWaybillCreateModalOpened(false)}>
				<Suspense fallback={<CircularProgress />}>
					<CDEKWaybillCreateForm orderId={order.id} onSubmit={createCDEKWaybill} />
				</Suspense>
			</Modal>
			<LoadingOverlay isOpened={showLoadingOverlay} />
			<Typography variant="subtitle0">СДЭК</Typography>
			<div className="gap-1 mt-2 d-f fd-c">
				{CDEKWaybillIsLoading ? (
					<CircularProgress />
				) : CDEKWaybill ? (
					<>
						<div className="gap-1 ai-c d-f fd-r">
							<Typography variant="body1">Накладная</Typography>
							{CDEKWaybill.status === "PENDING" ? (
								<CircularProgress size={20} />
							) : (
								<div className="ai-c d-f fd-r jc-sb">
									<Check sx={{ color: "success.main" }} />
									{CDEKWaybill.tracking && (
										<Tooltip title="Открыть заказ">
											<IconButton onClick={handleOpenCDEKOrder}>
												<OpenInNew />
											</IconButton>
										</Tooltip>
									)}
								</div>
							)}
						</div>
						<div className="gap-1 ai-c d-f fd-r">
							<Typography variant="body1">Распечатка</Typography>
							{CDEKWaybill.print ? (
								CDEKWaybill.print.status === "PENDING" ? (
									<CircularProgress size={20} />
								) : (
									<div className="ai-c d-f fd-r jc-sb">
										<Check
											sx={{
												color: "success.main",
											}}
										/>
										<Tooltip title="Открыть распечатку">
											<IconButton onClick={handleOpenWaybillPrint}>
												<OpenInNew />
											</IconButton>
										</Tooltip>
									</div>
								)
							) : (
								<div className="ai-c d-f fd-r jc-sb">
									<Close sx={{ color: "error.main" }} />
									<Button variant="contained" onClick={handleCreateCDEKWaybillPrint}>
										Сформировать
									</Button>
								</div>
							)}
						</div>
						<div className="gap-1 ai-c d-f fd-r">
							<Typography variant="body1">Трек-номер:</Typography>
							{CDEKWaybill.status === "PENDING" ? (
								<CircularProgress size={20} />
							) : (
								CDEKWaybill.tracking && (
									<div className="ai-c d-f fd-r jc-sb">
										<Typography variant="body1">{CDEKWaybill.tracking.code}</Typography>
										<Tooltip title="Открыть трекинг">
											<IconButton onClick={handleOpenCDEKTracking}>
												<OpenInNew />
											</IconButton>
										</Tooltip>
									</div>
								)
							)}
						</div>
					</>
				) : (
					<div className="gap-1 ai-c d-f fd-r">
						<Typography variant="body1">Накладная</Typography>
						<Close sx={{ color: "error.main" }} />
						<Button variant="contained" onClick={() => setWaybillCreateModalOpened(true)}>
							Сформировать
						</Button>
					</div>
				)}
			</div>
		</>
	);
};

export default OrderCDEKSection;
