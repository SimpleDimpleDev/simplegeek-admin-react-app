import { Straighten } from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";
import {
	type GridColDef,
	type GridLocaleText,
	DataGrid,
	GridRowSelectionModel,
	useGridApiRef,
	GridRowIdGetter,
	GridValidRowModel,
	GridToolbar,
} from "@mui/x-data-grid";

import { ReactNode } from "react";

const GRID_DEFAULT_LOCALE_TEXT: GridLocaleText = {
	// Root
	noRowsLabel: "No rows",
	noResultsOverlayLabel: "No results found.",

	// Density selector toolbar button text
	toolbarDensity: "Density",
	toolbarDensityLabel: "Density",
	toolbarDensityCompact: "Compact",
	toolbarDensityStandard: "Standard",
	toolbarDensityComfortable: "Comfortable",

	// Columns selector toolbar button text
	toolbarColumns: "Столбцы",
	toolbarColumnsLabel: "Выбрать столбцы",

	// Filters toolbar button text
	toolbarFilters: "Фильтры",
	toolbarFiltersLabel: "Показать фильтры",
	toolbarFiltersTooltipHide: "Скрыть фильтры",
	toolbarFiltersTooltipShow: "Показать фильтры",
	toolbarFiltersTooltipActive: (count) => (count !== 1 ? `${count} active filters` : `${count} active filter`),

	// Quick filter toolbar field
	toolbarQuickFilterPlaceholder: "Поиск…",
	toolbarQuickFilterLabel: "Поиск",
	toolbarQuickFilterDeleteIconLabel: "Очистить",

	// Export selector toolbar button text
	toolbarExport: "Export",
	toolbarExportLabel: "Export",
	toolbarExportCSV: "Download as CSV",
	toolbarExportPrint: "Print",
	toolbarExportExcel: "Download as Excel",

	// Columns management text
	columnsManagementSearchTitle: "Поиск",
	columnsManagementNoColumns: "No columns",
	columnsManagementShowHideAllText: "Show/Hide All",
	columnsManagementReset: "Сбросить",

	// Filter panel text
	filterPanelAddFilter: "Добавить фильтр",
	filterPanelRemoveAll: "Удалить все",
	filterPanelDeleteIconLabel: "Удалить",
	filterPanelLogicOperator: "Logic operator",
	filterPanelOperator: "Operator",
	filterPanelOperatorAnd: "И",
	filterPanelOperatorOr: "Или",
	filterPanelColumns: "Столбцы",
	filterPanelInputLabel: "Значение",
	filterPanelInputPlaceholder: "Значение фильтра",

	// Filter operators text
	filterOperatorContains: "Содержит",
	filterOperatorDoesNotContain: "Не содержит",
	filterOperatorEquals: "Равно",
	filterOperatorDoesNotEqual: "Не равно",
	filterOperatorStartsWith: "Начинается с",
	filterOperatorEndsWith: "Оканчивается на",
	filterOperatorIs: "is",
	filterOperatorNot: "is not",
	filterOperatorAfter: "is after",
	filterOperatorOnOrAfter: "is on or after",
	filterOperatorBefore: "is before",
	filterOperatorOnOrBefore: "is on or before",
	filterOperatorIsEmpty: "is empty",
	filterOperatorIsNotEmpty: "is not empty",
	filterOperatorIsAnyOf: "is any of",
	"filterOperator=": "=",
	"filterOperator!=": "!=",
	"filterOperator>": ">",
	"filterOperator>=": ">=",
	"filterOperator<": "<",
	"filterOperator<=": "<=",

	// Header filter operators text
	headerFilterOperatorContains: "Содержит",
	headerFilterOperatorDoesNotContain: "Не содержит",
	headerFilterOperatorEquals: "Равно",
	headerFilterOperatorDoesNotEqual: "Не равно",
	headerFilterOperatorStartsWith: "Начинается с",
	headerFilterOperatorEndsWith: "Оканчивается на",
	headerFilterOperatorIs: "Is",
	headerFilterOperatorNot: "Is not",
	headerFilterOperatorAfter: "Is after",
	headerFilterOperatorOnOrAfter: "Is on or after",
	headerFilterOperatorBefore: "Is before",
	headerFilterOperatorOnOrBefore: "Is on or before",
	headerFilterOperatorIsEmpty: "Is empty",
	headerFilterOperatorIsNotEmpty: "Is not empty",
	headerFilterOperatorIsAnyOf: "Is any of",
	"headerFilterOperator=": "Equals",
	"headerFilterOperator!=": "Not equals",
	"headerFilterOperator>": "Greater than",
	"headerFilterOperator>=": "Greater than or equal to",
	"headerFilterOperator<": "Less than",
	"headerFilterOperator<=": "Less than or equal to",

	// Filter values text
	filterValueAny: "Любое",
	filterValueTrue: "Истина",
	filterValueFalse: "Ложь",

	// Column menu text
	columnMenuLabel: "Меню",
	columnMenuShowColumns: "Показать столбцы",
	columnMenuManageColumns: "Настроить столбцы",
	columnMenuFilter: "Фильтр",
	columnMenuHideColumn: "Скрыть столбец",
	columnMenuUnsort: "Рассортировать",
	columnMenuSortAsc: "Сортировать по возрастанию",
	columnMenuSortDesc: "Сортировать по убыванию",

	// Column header text
	columnHeaderFiltersTooltipActive: (count) => (count !== 1 ? `${count} active filters` : `${count} active filter`),
	columnHeaderFiltersLabel: "Show filters",
	columnHeaderSortIconLabel: "Sort",

	// Rows selected footer text
	footerRowSelected: (count) =>
		count !== 1 ? `${count.toLocaleString()} строк выбрано` : `${count.toLocaleString()} строка выбрана`,

	// Total row amount footer text
	footerTotalRows: "Всего строк:",

	// Total visible row amount footer text
	footerTotalVisibleRows: (visibleCount, totalCount) =>
		`${visibleCount.toLocaleString()} of ${totalCount.toLocaleString()}`,

	// Checkbox selection text
	checkboxSelectionHeaderName: "Checkbox selection",
	checkboxSelectionSelectAllRows: "Select all rows",
	checkboxSelectionUnselectAllRows: "Unselect all rows",
	checkboxSelectionSelectRow: "Select row",
	checkboxSelectionUnselectRow: "Unselect row",

	// Boolean cell text
	booleanCellTrueLabel: "yes",
	booleanCellFalseLabel: "no",

	// Actions cell more text
	actionsCellMore: "more",

	// Column pinning text
	pinToLeft: "Pin to left",
	pinToRight: "Pin to right",
	unpin: "Unpin",

	// Tree Data
	treeDataGroupingHeaderName: "Group",
	treeDataExpand: "see children",
	treeDataCollapse: "hide children",

	// Grouping columns
	groupingColumnHeaderName: "Group",
	groupColumn: (name) => `Group by ${name}`,
	unGroupColumn: (name) => `Stop grouping by ${name}`,

	// Master/detail
	detailPanelToggle: "Detail panel toggle",
	expandDetailPanel: "Expand",
	collapseDetailPanel: "Collapse",

	// Used core components translation keys
	MuiTablePagination: {},

	// Row reordering text
	rowReorderingHeaderName: "Row reordering",

	// Aggregation
	aggregationMenuItemHeader: "Aggregation",
	aggregationFunctionLabelSum: "sum",
	aggregationFunctionLabelAvg: "avg",
	aggregationFunctionLabelMin: "min",
	aggregationFunctionLabelMax: "max",
	aggregationFunctionLabelSize: "size",
};

interface Props {
	columns: GridColDef[];
	data: GridValidRowModel[];
	selectedRows: GridRowSelectionModel;
	onRowSelect: (ids: GridRowSelectionModel) => void;
	leftHeaderButtons?: ReactNode;
	headerButtons?: ReactNode;
	getRowId?: GridRowIdGetter;
}

const AdminTable = ({
	columns,
	data,
	selectedRows,
	onRowSelect,
	leftHeaderButtons,
	headerButtons,
	getRowId,
}: Props) => {
	const apiRef = useGridApiRef();

	return (
		<>
			<div className="gap-2 pt-2 d-f fd-c">
				<div className="w-100 d-f fd-r jc-sb">
					<div className="gap-1 w-100 ai-c d-f fd-r">
						<IconButton
							onClick={() =>
								apiRef.current.autosizeColumns({
									columns: columns.map((col) => col.field),
									includeHeaders: true,
									includeOutliers: true,
									expand: true,
								})
							}
						>
							<Straighten />
						</IconButton>
						{leftHeaderButtons}
					</div>
					<div className="gap-1 w-100 ai-c d-f fd-r jc-fe">{headerButtons}</div>
				</div>
			</div>

			<div className="mt-2" style={{ flex: 1, overflow: "auto" }}>
				<DataGrid
					apiRef={apiRef}
					rows={data}
					columns={columns}
					rowSelection={true}
					rowSelectionModel={selectedRows}
					onRowSelectionModelChange={onRowSelect}
					getRowId={getRowId}
					getRowHeight={() => "auto"}
					initialState={{
						sorting: {
							sortModel: [{ field: "createdAt", sort: "desc" }],
						},
						columns: {
							columnVisibilityModel: {
								updatedAt: false,
							},
						},
					}}
					sx={{
						"& .MuiDataGrid-columnHeaderTitle": {
							fontSize: 14,
							fontWeight: 700,
						},
						"--DataGrid-overlayHeight": "300px",
						// '--DataGrid-containerBackground': 'none',
					}}
					checkboxSelection
					autosizeOptions={{
						columns: columns.map((col) => col.field),
						includeHeaders: true,
						includeOutliers: true,
						expand: true,
					}}
					autosizeOnMount={true}
					getRowClassName={() => "bg-primary"}
					slots={{
						noRowsOverlay: () => (
							<div className="w-100 h-100 ai-c d-f jc-c">
								<Typography variant="body1">Нет данных</Typography>
							</div>
						),
						toolbar: GridToolbar,
					}}
					localeText={GRID_DEFAULT_LOCALE_TEXT}
					slotProps={{
						toolbar: {
							showQuickFilter: true,
						},
					}}
				/>
			</div>
		</>
	);
};

export default AdminTable;
