import React, { useState } from "react";
import { Link } from "react-router-dom";

interface Data {
    service: any;
    characteristics: any;
}

const SERVICE_UUID_START = 0x1800;
const SERVICE_UUID_END = 0xffff;

export const GetServicesAndCharacteristicsPage: React.FC = () => {
    const [dataList, setDataList] = useState<Data[]>([]);

    const onClickSearch = async () => {
        if ("bluetooth" in window.navigator) {
            const device = await (window.navigator["bluetooth"] as any).requestDevice({
                acceptAllDevices: true,
                optionalServices: Array(SERVICE_UUID_END - SERVICE_UUID_START).fill(0).map((_, i) => (SERVICE_UUID_START + i)),
            });
            const server = await device.gatt.connect();
            const services = await server.getPrimaryServices();
            const dataList = await Promise.all<Data>(services.map(async (v: any)=> ({
                service: v,
                characteristics: await v.getCharacteristics(),
            }) as Data));
            setDataList(dataList);
        }
    };

    return <>
        <h2>GetServicesAndCharacteristicsPage</h2>
        <button onClick={onClickSearch}>search</button>
        {dataList.map((v, i) => (
            <dl key={i}>
                <dt>Searvice:</dt>
                <dd>
                    <input
                        type="text"
                        defaultValue={v.service.uuid}
                    />
                </dd>
                <dt>Characteristics:</dt>
                <dd>
                    <dl>
                        {v.characteristics.map((c: any) => [
                            <dt key="0">
                                <input
                                    type="text"
                                    defaultValue={c.uuid}
                                />
                            </dt>,
                            <dd key="1"><Link to={`/cc?s=${v.service.uuid}&c=${c.uuid}`}>Value check.</Link></dd>,
                        ])}
                    </dl>
                </dd>
            </dl>
        ))}
    </>;
};
