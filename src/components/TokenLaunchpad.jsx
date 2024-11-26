import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { TOKEN_2022_PROGRAM_ID, getMintLen, createInitializeMetadataPointerInstruction, createInitializeMintInstruction, TYPE_SIZE, LENGTH_SIZE, ExtensionType } from "@solana/spl-token"
import { createInitializeInstruction, pack } from '@solana/spl-token-metadata';
import { useState } from "react";


export function TokenLaunchpad() {
    const { connection } = useConnection();
    const wallet = useWallet();
    const [name,setName] = useState('');
    const [symbol,setSymbol] = useState('');
    const [imageurl,setImageurl] = useState('');

    async function createToken() {
        const mintKeypair = Keypair.generate();
        const metadata = {
            mint: mintKeypair.publicKey,
            name: name,
            symbol: symbol,
            uri: imageurl,
            additionalMetadata: [],
        };

        const mintLen = getMintLen([ExtensionType.MetadataPointer]);
        const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;

        const lamports = await connection.getMinimumBalanceForRentExemption(mintLen + metadataLen);

        const transaction = new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey: wallet.publicKey,
                newAccountPubkey: mintKeypair.publicKey,
                space: mintLen,
                lamports,
                programId: TOKEN_2022_PROGRAM_ID,
            }),
            createInitializeMetadataPointerInstruction(mintKeypair.publicKey, wallet.publicKey, mintKeypair.publicKey, TOKEN_2022_PROGRAM_ID),
            createInitializeMintInstruction(mintKeypair.publicKey, 9, wallet.publicKey, null, TOKEN_2022_PROGRAM_ID),
            createInitializeInstruction({
                programId: TOKEN_2022_PROGRAM_ID,
                mint: mintKeypair.publicKey,
                metadata: mintKeypair.publicKey,
                name: metadata.name,
                symbol: metadata.symbol,
                uri: metadata.uri,
                mintAuthority: wallet.publicKey,
                updateAuthority: wallet.publicKey,
            }),
        );
            
        transaction.feePayer = wallet.publicKey;
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        transaction.partialSign(mintKeypair);

        await wallet.sendTransaction(transaction, connection);
    }

    return(
        <div>
            <div className="w-full justify-center flex mt-5">
                <div className="container"> <h2 className="text-2xl ">The perfect tool to create Solana SPL tokens on Devenet. Simple, user friendly, and fast.</h2></div>
            </div>
            <section className="flex w-full justify-center mt-5 mb-10">
                <div className="container grid grid-cols-1 items-start lg:grid-cols-2 gap-4">
                    <div className="flex flex-col justify-center w-full px-7 mt-8">
                        <h1 className="font-bold text-2xl text-start text-[#EBD3F8]">Solana Token Creator</h1>
                        <div className="border border-[#FF6500] bg-[#1e3e622b] rounded-md p-5 mt-4">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-4">
                                <div>
                                    <label className="text-lg">Token Name</label>
                                    <br />
                                    <input className='inputText bg-[#ff66004a] px-2 py-1 rounded max-w-[90%]' type='text' onChange={(e)=>(setName(e.target.value))} placeholder='Name'></input>
                                </div>
                                <div>
                                    <label className="text-lg">Symbol</label>
                                        <br />
                                    <input className='inputText bg-[#ff66004a] px-2 py-1 rounded max-w-[90%]' type='text' onChange={(e)=>(setSymbol(e.target.value))} placeholder='Symbol'></input>
                                </div>
                            </div>
                            <div className="w-full mt-3">
                                <label className="text-lg">ImageUrl</label>
                                <br />
                                <input className='inputText bg-[#ff66004a] px-2 py-1 rounded w-[80%]' type='text' onChange={(e)=>(setImageurl(e.target.value))} placeholder='Name'></input>
                            </div>
                            <button className="mt-7 bg-[#ff6600ba] rounded-md px-4 py-2 hover:bg-[#FF6500]">Create Token</button>
                        </div>
                    </div>
                    <div className="text-xl px-7 mt-4">

                        <h2 className="text-2xl font-bold mb-4">How to use Solana Token Creator</h2>
                        <h2 className="mb-2">1. Connect your Solana wallet.</h2>
                        <h2 className="mb-2">2. Specify the desired name for your Token</h2>
                        <h2 className="mb-2">3. Indicate the symbol (max 8 characters).</h2>
                        <h2 className="mb-2">4. Select the decimals quantity (default recommended 6 for all tokens)</h2>
                        <h2 className="mb-2">5. Provide a brief description for your SPL Token.</h2>
                        <h2 className="mb-2">6. Upload the image for your token (PNG).</h2>
                        <h2 className="mb-2">7. Determine the Supply of your Token.</h2>
                        <h2 className="mb-2">8. Click on create, accept the transaction and wait until your tokens ready.</h2>

                        <h2 className="mt-6 text-lg">
                            The cost of Token creation is <span className="text-[#FF6500] font-bold">0.3 SOL</span>, covering all fees for SPL Token Creation.
                        </h2>
                    </div>
                </div>
            </section>
        </div>
    )
}