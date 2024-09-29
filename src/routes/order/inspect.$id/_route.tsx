import { Button, Divider, Stack, Typography } from "@mui/material";
import { DateFormatter, getRuGoodsWord } from "@utils/format";
import { useNavigate, useParams } from "react-router-dom";

import { ChevronLeft } from "@mui/icons-material";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { getImageUrl } from "@utils/image";
import { orderStatusBadges } from "@components/Badges";
import { useGetOrderQuery } from "@api/admin/order";

export default function OrderInspectRoute() {
	const navigate = useNavigate();
	const params = useParams();
	const orderId = params.id;
	if (!orderId) throw new Response("No order id provided", { status: 404 });
	const { data: order, isLoading: orderIsLoading } = useGetOrderQuery({ orderId });
	return (
		<div className="pt-4">
			<Button onClick={() => navigate("/order/table")} sx={{ width: "fit-content", color: "warning.main" }}>
				<ChevronLeft />К списку всех заказов
			</Button>
			<LoadingSpinner isLoading={orderIsLoading}>
				{!order ? (
					<div className="w-100 h-100v ai-c d-f jc-c">
						<Typography variant="h5">Что-то пошло не так</Typography>
					</div>
				) : (
					<>
						<div className="py-2">
							<Typography variant="h3">Заказ от {DateFormatter.DDMMYYYY(new Date())}</Typography>
							<Typography variant="subtitle0">ID: Order id</Typography>
						</div>
						<div className="gap-1 pb-4 d-f fd-r">{orderStatusBadges["ACCEPTED"]}</div>

						<div className="section">
							<Typography variant="h5">Платёж заказа</Typography>
							<Typography variant="body1">Сумма: {order.initialInvoice.amount}</Typography>
							<Typography variant="body1">
								Создан: {DateFormatter.DDMMYYYY(order.initialInvoice.createdAt)}
							</Typography>
							<Typography variant="body1">Оплачено: {order.initialInvoice.isPaid}</Typography>
						</div>

						<div className="section">
							<Typography variant="h5">
								{order.items.length} {getRuGoodsWord(order.items.length)}
							</Typography>
							<Stack divider={<Divider />}>
								{order.items.map((item) => (
									<div className="gap-1 pt-1 d-f fd-c" key={item.id}>
										<div className="w-100 d-f fd-r jc-sb">
											<div className="gap-1 w-100 d-f fd-r">
												<div className="br-2" style={{ width: 96, height: 96 }}>
													<img className="contain" src={getImageUrl(item.image, "small")} />
												</div>
												<div className="d-f fd-c jc-sb">
													<div className="gap-1">
														<Typography variant="h6">{item.title}</Typography>
														<Typography variant="body1">{item.quantity} шт.</Typography>
													</div>
												</div>
											</div>
											<div className="d-f fd-r fs-0">
												<Typography variant="subtitle1">{item.sum} ₽</Typography>
											</div>
										</div>
									</div>
								))}
							</Stack>
						</div>
					</>
				)}
			</LoadingSpinner>
		</div>
	);
}
