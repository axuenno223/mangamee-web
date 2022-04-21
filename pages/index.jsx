import MangaCard from '@/components/card/MangaCard';
import Layout from '@/components/layout/Layout';
import { useEffect, useState } from 'react';
import MangaCardSkeleton from '@/components/loading/MangaCardSkeleton';
import MangameeApi from '@/lib/api';
import SourceCard from '@/components/card/SourceCard';

export default function Home() {

    const [page, setPage] = useState(1);
    const [source, setSource] = useState(1);
    const [mangaData, setMangaData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mangaSource, setMangaSource] = useState([])

    const initPage = async () => {
        let fetch = await MangameeApi.fetchIndex({ source: source, page: page })
        if (fetch.status == 200) {
            let res = await fetch.json()
            if (page == 1) {
                setMangaData(res);
            } else {
                setMangaData((prev) => [...prev, ...res]);
            }
            setLoading(false);
        }
    };

    useEffect(async() => {
        let fetch = await MangameeApi.fetchSource()
        setMangaSource(fetch)
    }, [])

    useEffect(() => {
        setLoading(true)
        setMangaData([])
        initPage()
    }, [source])

    useEffect(() => {
        initPage();
    }, [page]);

    if (loading)
        return (
            <Layout>
                <div className='flex px-5 py-5 space-x-3'>
                    {mangaSource.map((value, index) => (
                        <SourceCard
                            key={index}
                            name={value.name}
                            source={source}
                            setSource={setSource}
                            sourceId={value.id}
                        />
                    ))}
                </div>
                <MangaCardSkeleton />
            </Layout>
        );

    return (
        <Layout >
            <div className='flex px-5 py-5 space-x-3'>
                {mangaSource.map((value, index) => (
                    <SourceCard
                        key={index}
                        name={value.name}
                        source={source}
                        setSource={setSource}
                        sourceId={value.id}
                    />
                ))}
            </div>
            <div className='grid grid-cols-2 sm:grid-cols-5 sm:gap-6 gap-4 px-5 py-2'>
                {mangaData?.map((value, index) => (
                    <MangaCard value={value} source={source} key={index} />
                ))}
            </div>
            <div className='flex justify-center items-center py-3'>
                <button className='bg-white px-5 py-2 rounded-xl opacity-80' onClick={() => setPage(page + 1)}>
                    <span className='text-gray-900 text-sm'>
                        More
                    </span>
                </button>
            </div>
        </Layout>
    );
}
