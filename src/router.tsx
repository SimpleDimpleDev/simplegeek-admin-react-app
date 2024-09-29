import { Route, Routes } from "react-router-dom";

import AppLayout from "./AppLayout";
import { CategoryRouteLazy } from "@routes/category/_lazy.tsx";
import { FaqRouteLazy } from "@routes/faq/_lazy.tsx";
import { FilterRouteLazy } from "@routes/filter/_lazy.tsx";
import { IndexRouteLazy } from "@routes/_index/_lazy.tsx";
import { LoadingOverlay } from "@components/LoadingOverlay";
import { OrderInspectRouteLazy } from "@routes/order/inspect.$id/_lazy.tsx";
import { OrderTableRouteLazy } from "@routes/order/table/_lazy.tsx";
import { ProductCreateRouteLazy } from "@routes/product/create/_lazy.tsx";
import { ProductInspectRouteLazy } from "@routes/product/inspect.$id/_lazy.tsx";
import { ProductTableRouteLazy } from "@routes/product/table/_lazy.tsx";
import { ProductUpdateRouteLazy } from "@routes/product/update.$id/_lazy.tsx";
import { PublicationCreateRouteLazy } from "@routes/publication/create/_lazy.tsx";
import { PublicationInspectRouteLazy } from "@routes/publication/inspect.$id/_lazy.tsx";
import { PublicationTableRouteLazy } from "@routes/publication/table/_lazy.tsx";
import { Suspense } from "react";
import SuspenseRouter from "@utils/SuspenseRouter";
import { TestRouteLazy } from "@routes/test/_lazy.tsx";
import { UserInspectRouteLazy } from "@routes/user/inspect.$id/_lazy.tsx";
import { UserTableRouteLazy } from "@routes/user/table/_lazy.tsx";

const AppRouter: React.FC = () => (
	<SuspenseRouter>
		<Suspense fallback={<LoadingOverlay isOpened={true} />}>
			<Routes>
				<Route element={<AppLayout />}>
					<Route index element={<IndexRouteLazy />} />
					<Route path="category" element={<CategoryRouteLazy />} />
					<Route path="faq" element={<FaqRouteLazy />} />
					<Route path="filter" element={<FilterRouteLazy />} />
					<Route path="order">
						<Route path="inspect/:id" element={<OrderInspectRouteLazy />} />
						<Route path="table" element={<OrderTableRouteLazy />} />
					</Route>
					<Route path="product">
						<Route path="create" element={<ProductCreateRouteLazy />} />
						<Route path="table" element={<ProductTableRouteLazy />} />
						<Route path="inspect/:id" element={<ProductInspectRouteLazy />} />
						<Route path="edit/:id" element={<ProductUpdateRouteLazy />} />
					</Route>
					<Route path="publication">
						<Route path="create" element={<PublicationCreateRouteLazy />} />
						<Route path="table" element={<PublicationTableRouteLazy />} />
						<Route path="inspect/:id" element={<PublicationInspectRouteLazy />} />
					</Route>
					<Route path="user">
						<Route path="table" element={<UserTableRouteLazy />} />
						<Route path="inspect/:id" element={<UserInspectRouteLazy />} />
					</Route>
				</Route>
				<Route path="test" element={<TestRouteLazy />} />
			</Routes>
		</Suspense>
	</SuspenseRouter>
);

export { AppRouter };
