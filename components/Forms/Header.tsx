
export default function FormHeader({ title}: { title: string }) {
    return (
        <header className="bg-gray-700 text-white px-4 py-2.5 font-medium text-sm">
            {title}
        </header>
    )
}
