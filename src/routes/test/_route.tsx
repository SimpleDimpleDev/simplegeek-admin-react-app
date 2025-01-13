import { Paper, Typography } from "@mui/material";

import { InvoiceGet } from "@appTypes/Payment";
import { InvoiceStatusBadges } from "@components/Badges";

const testInvoices: InvoiceGet[] = [
	{
		id: "1",
		amount: 100,
		createdAt: new Date(),
		updatedAt: new Date(),
		status: "PAID",
		title: "Платеж 1",
		expiresAt: new Date(),
	},
	{
		id: "2",
		amount: 200,
		createdAt: new Date(),
		updatedAt: new Date(),
		status: "UNPAID",
		title: "Платеж 2",
		expiresAt: new Date(),
	},
	{
		id: "3",
		amount: 300,
		createdAt: new Date(),
		updatedAt: new Date(),
		status: "WAITING",
		title: "Платеж 3",
		expiresAt: new Date(),
	},
	{
		id: "4",
		amount: 400,
		createdAt: new Date(),
		updatedAt: new Date(),
		status: "REFUNDED",
		title: "Платеж 4",
		expiresAt: new Date(),
	},
];

type InvoiceBlockProps = {
	invoice: InvoiceGet;
};

const InvoiceBlock = ({ invoice }: InvoiceBlockProps) => {
	return (
		<Paper sx={{ p: 2 }}>
			<Typography variant="subtitle0">{invoice.title}</Typography>
			<div className="gap-1 mt-2 d-f fd-c">
				<Typography variant="body1">Сумма: {invoice.amount}₽</Typography>
				<Typography variant="body1">
					Создан:{" "}
					{new Intl.DateTimeFormat("ru", {
						year: "numeric",
						month: "numeric",
						day: "numeric",
						hour: "numeric",
						minute: "numeric",
						second: "numeric",
					}).format(invoice.createdAt)}
				</Typography>

				<div className="gap-1 ai-fs d-f fd-c">{InvoiceStatusBadges[invoice.status]}</div>
			</div>
		</Paper>
	);
};

export default function TestRoute() {
	return (
		<div className="p-2">
			<div className="gap-2 d-f fd-r">
				{testInvoices.map((invoice) => (
					<InvoiceBlock key={invoice.id} invoice={invoice} />
				))}
			</div>
		</div>
	);
}
