import { Radio, Typography } from "@mui/material";

import { CreditInfo } from "@appTypes/Credit";

export type OrderItemCardProps = {
	imgUrl: string;
	title: string;
	quantity: number;
	price: number;
};

export const OrderItemCard: React.FC<OrderItemCardProps> = ({ imgUrl, title, quantity, price }) => {
	return (
		<div className="w-100 d-f fd-r jc-sb">
			<div className="d-f fd-r gap-1">
				<div className="d-f jc-c ai-c br-2 fs-0 of-h" style={{ width: 96, height: 96 }}>
					<img src={imgUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
				</div>
				<div className="d-f fd-c gap-1 pt-2">
					<Typography variant="body1">{title}</Typography>
					<Typography variant="body2" sx={{ color: "typography.secondary" }}>
						{quantity} шт.
					</Typography>
				</div>
			</div>
			<div className="pt-2">
				<Typography variant="subtitle1">{price} ₽</Typography>
			</div>
		</div>
	);
};

type OrderItemCardCreditProps = OrderItemCardProps & {
	creditInfo: CreditInfo;
	isCredit: boolean;
	onCreditChange: (isCredit: boolean) => void;
};

export const OrderItemCardCredit: React.FC<OrderItemCardCreditProps> = ({
	imgUrl,
	title,
	quantity,
	price,
	isCredit,
	creditInfo,
	onCreditChange,
}) => {
	return (
		<div className="w-100 d-f fd-c gap-1">
			<OrderItemCard imgUrl={imgUrl} title={title} quantity={quantity} price={price} />
			<div className="d-f fd-r gap-1">
				<div className="d-f fd-r gap-05">
					<Radio checked={isCredit} onChange={() => onCreditChange(true)} color="warning" />
					<div className="d-f fd-c gap-05">
						<Typography variant="body1">Оплатить всю суму сразу</Typography>
						<Typography variant="body2" sx={{ color: "typography.secondary" }}>
							{price} ₽
						</Typography>
					</div>
				</div>
				<div className="d-f fd-r gap-05">
					<Radio checked={!isCredit} onChange={() => onCreditChange(false)} color="warning" />
					<div className="d-f fd-c gap-05">
						<Typography variant="body1">В рассрочку</Typography>
						<Typography variant="body2" sx={{ color: "typography.secondary" }}>
							{creditInfo.payments.length} платежа от {creditInfo.payments[0].sum} ₽
						</Typography>
					</div>
				</div>
			</div>
		</div>
	);
};
