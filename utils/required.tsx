export const RequiredLabel = ({
    htmlFor,
    children,
    }: {
    htmlFor: string;
    children: string;
    }) => (
    <label htmlFor={htmlFor} className="mb-1 text-sm font-semibold text-green-900">
        {children} <span className="text-red-500">*</span>
    </label>
);