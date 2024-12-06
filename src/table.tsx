import {
    Card,
    Typography
} from "@material-tailwind/react";
import { Pri } from './type';

const TABLE_HEAD = ["Codice", "Modulo", "Voto"];

export function SortableTable({ marks }: { marks: Pri[] }) {
    // Define a skeleton row count
    const skeletonRows = Array.from({ length: 20 }, (_, index) => index);

    return (
        <Card className="h-full w-full" placeholder="" onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
            <table className="w-full min-w-max table-auto text-left">
                <thead>
                    <tr>
                        {TABLE_HEAD.map((head) => (
                            <th
                                key={head}
                                className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50 text-left w-1/3"
                            >
                                <Typography
                                    placeholder=""
                                    onPointerEnterCapture={() => { }}
                                    onPointerLeaveCapture={() => { }}
                                    variant="small"
                                    color="blue-gray"
                                    className="flex items-left justify-left gap-2 font-black leading-none"
                                >
                                    {head}{" "}
                                </Typography>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {(!marks || marks.length === 0) ? (
                        // Render skeleton rows when marks are undefined or empty
                        skeletonRows.map((_, index) => (
                            <tr key={index} className="even:bg-blue-gray-50/50">
                                <td className="p-3 text-left">
                                    <div className="h-6 w-full bg-gray-500 rounded animate-pulse"></div>
                                </td>
                                <td className="p-3 text-left">
                                    <div className="h-6 w-full bg-gray-500 rounded animate-pulse"></div>
                                </td>
                                <td className="p-3 text-left">
                                    <div className="h-6 w-full bg-gray-500 rounded animate-pulse"></div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        // Render actual data when marks are available
                        marks.map((mark, index) => (
                            <tr key={index} className="even:bg-blue-gray-50/50">
                                <td className="p-3 text-left">
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-semibold"
                                        placeholder=""
                                        onPointerEnterCapture={() => { }}
                                        onPointerLeaveCapture={() => { }}
                                    >
                                        {mark.CodiceModulo}
                                    </Typography>
                                </td>
                                <td className="p-3 text-left">
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-semibold"
                                        placeholder=""
                                        onPointerEnterCapture={() => { }}
                                        onPointerLeaveCapture={() => { }}
                                    >
                                        {mark.TitoloModulo}
                                    </Typography>
                                </td>
                                <td className="p-3 text-left">
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className={mark.voto ? "font-semibold" : "italic"}
                                        placeholder=""
                                        onPointerEnterCapture={() => { }}
                                        onPointerLeaveCapture={() => { }}
                                    >
                                        {mark.voto ? `${mark.voto} / 30` : "Nessuna valutazione"}
                                    </Typography>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </Card>
    );
}
