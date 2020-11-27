import React, { useEffect, useState } from "react";
import { useRouter } from "hooks/useRouter";

const CHARACTERISTIC_PROPERTIES = [
    "read",
    "write",
    "notify",
    // "authenticatedSignedWrites",
    // "broadcast",
    // "indicate",
    // "reliableWrite",
    // "writableAuxiliaries",
    // "writeWithoutResponse",
] as const;

export const ControlCharacteristicPage: React.FC = () => {
    const router = useRouter();
    const qS = (router.query as any).s;
    const qC = (router.query as any).c;
    const [serviceId, setServiceId] = useState<string>(qS);
    const [characteristicId, setCharacteristicId] = useState<string>(qC);
    const [characteristic, setCharacteristic] = useState<any>(null);
    const [valueList, setValueList] = useState<{ [key:string]: string }>({});
    const [notifyValueList, setNotifyValueList] = useState<{ [key:string]: string }>({});
    const [writeValue, setWriteValue] = useState<string>("");

    const onChangeService = (e: React.ChangeEvent<HTMLInputElement>) => {
        setServiceId(e.target.value);
    }

    const onChangeCharacteristic = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCharacteristicId(e.target.value);
    }

    const getValueList = (value: DataView) => {
        const buffer = value.buffer;
        const decoder = new TextDecoder("utf-8");
        const vl = {} as {[key: string]: string};
        try { vl["string"] = decoder.decode(value); } catch (e) { vl["string"] = ""; }
        try { vl["uint8"] = new Uint8Array(buffer).join(","); } catch (e) { vl["uint8"] = ""; }
        try { vl["uint16"] = new Uint16Array(buffer).join(","); } catch (e) { vl["uint16"] = ""; }
        try { vl["uint32"] = new Uint32Array(buffer).join(","); } catch (e) { vl["uint32"] = ""; }
        try { vl["int8"] = new Uint8Array(buffer).join(","); } catch (e) { vl["int8"] = ""; }
        try { vl["int16"] = new Uint16Array(buffer).join(","); } catch (e) { vl["int16"] = ""; }
        try { vl["int32"] = new Uint32Array(buffer).join(","); } catch (e) { vl["int32"] = ""; }

        return vl;
    }

    const readValue = async () => {
        if(characteristic.properties.read) {
            try {
                const value = await characteristic.readValue();
                const vl = getValueList(value);
                setValueList(vl);
            } catch (e) {
                setValueList({ error: e.message });
            }
        } else {
            setValueList({});
        }
    }

    const onClickSearch = async () => {
        if ("bluetooth" in window.navigator) {
            const sid = serviceId.includes("-") ? serviceId : Number.parseInt(serviceId, 16);
            const cid = characteristicId.includes("-") ? characteristicId : Number.parseInt(characteristicId, 16);
            const device = await (window.navigator["bluetooth"] as any).requestDevice({
                filters: [{services: [sid]}],
            });
            const server = await device.gatt.connect();
            const service = await server.getPrimaryService(sid);
            const characteristic = await service.getCharacteristic(cid);
            setCharacteristic(characteristic);

            if(characteristic.properties.notify) {
                const handler = (event: any) => {
                    const value = event.target.value;
                    const vl = getValueList(value);
                    setNotifyValueList(vl);
                }
                characteristic.addEventListener("characteristicvaluechanged", handler)
                characteristic.startNotifications();
            }
        }
    };

    const onClickWrite = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!characteristic) return;
        const encoder = new TextEncoder();
        characteristic.writeValue(encoder.encode(writeValue));
        setWriteValue("");
    };

    const onChangeWriteValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWriteValue(e.target.value);
    };

    return <>
        <h2>ValueCheckPage</h2>
        <div>ServiceUUID: <input defaultValue={serviceId} onChange={onChangeService} /></div>
        <div>CharacteristicsUUID: <input defaultValue={characteristicId} onChange={onChangeCharacteristic} /></div>
        <button onClick={onClickSearch}>search</button>
        {characteristic &&
            <div>
                <dl>
                    <dt>UUID:</dt>
                    <dd>{characteristic.uuid}</dd>
                    <dt>Properties:</dt>
                    {CHARACTERISTIC_PROPERTIES.map((k) => (
                        <dd key={k}>{k}: {characteristic.properties[k].toString()}</dd>
                    ))}
                    <dt>Read:</dt>
                    {characteristic.properties.read && [
                        ...Object.keys(valueList).map((k) => (
                            <dd key={k}>{k}: {valueList[k]}</dd>
                        )),
                        <dd key="0"><button onClick={readValue}>read</button></dd>,
                    ]}
                    <dt>Write:</dt>
                    {characteristic.properties.write && [
                        <dd key="0"><input onChange={onChangeWriteValue} value={writeValue} /></dd>,
                        <dd key="1"><button onClick={onClickWrite}>write</button></dd>,
                    ]}
                    <dt>Notify:</dt>
                    {Object.keys(notifyValueList).map((k, i) => (
                        <dd key={i}>{k}: {notifyValueList[k]}</dd>
                    ))}
                </dl>
            </div>
        }
    </>;
};
