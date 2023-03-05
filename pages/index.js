import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
//import ManualHeader from "../components/manualheader";
import Header from "../components/header";
import LotteryEntrance from "../components/lotteryentrance";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
	return (
		<div className={styles.container}>
			<Head>
				<title>Smart Contract Lottery</title>
				<meta name="description" content="A decentralized lottery" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Header />
			<LotteryEntrance />
		</div>
	);
}
