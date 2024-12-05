import {
    Card,
    Typography,
    Chip
} from "@material-tailwind/react";
import { Marks, Pri } from './type'

const TABLE_HEAD = ["Codice", "Modulo", "Voto"];

const TABLE_ROWS = [
    {
        img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-3.jpg",
        name: "John Michael",
        email: "john@creative-tim.com",
        job: "Manager",
        org: "Organization",
        online: true,
        date: "23/04/18",
    },
    {
        img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-2.jpg",
        name: "Alexa Liras",
        email: "alexa@creative-tim.com",
        job: "Programator",
        org: "Developer",
        online: false,
        date: "23/04/18",
    },
    {
        img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-1.jpg",
        name: "Laurent Perrier",
        email: "laurent@creative-tim.com",
        job: "Executive",
        org: "Projects",
        online: false,
        date: "19/09/17",
    },
    {
        img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-4.jpg",
        name: "Michael Levi",
        email: "michael@creative-tim.com",
        job: "Programator",
        org: "Developer",
        online: true,
        date: "24/12/08",
    },
    {
        img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-5.jpg",
        name: "Richard Gran",
        email: "richard@creative-tim.com",
        job: "Manager",
        org: "Executive",
        online: false,
        date: "04/10/21",
    },
];

export function SortableTable({ marks }: { marks: Marks[] }) {
    return (
        <Card className="h-full w-full" placeholder="" onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
            <table className="w-full min-w-max table-auto text-left">
                <thead>
                    <tr>
                        {TABLE_HEAD.map((head, index) => (
                            <th
                                key={head}
                                className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50 text-center"
                            >
                                <Typography placeholder="" onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}
                                    variant="small"
                                    color="blue-gray"
                                    className="flex items-center justify-center gap-2 font-normal leading-none opacity-70"
                                >
                                    {head}{" "}
                                </Typography>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {marks.map((mark, index) => {
                        const tempMark = mark.PRI ? mark.PRI : mark.SEC;
                        return (
                            <tr key={index} className="even:bg-blue-gray-50/50">
                                <td className="p-4 text-center">
                                    <Typography variant="small" color="blue-gray" className="font-normal" placeholder="" onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
                                        {tempMark ? tempMark. : 'N/A'}
                                    </Typography>
                                </td>
                                <td className="p-4 text-center">
                                    <Typography variant="small" color="blue-gray" className="font-normal" placeholder="" onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
                                        {tempMark.modulo}
                                    </Typography>
                                </td>
                                <td className="p-4 text-center">
                                    <Typography variant="small" color="blue-gray" className="font-normal" placeholder="" onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
                                        {mark.voto}
                                    </Typography>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </Card>
    );
}