import { createInitializeAccount2Instruction, createMint, getMinimumBalanceForRentExemptMint, MINT_SIZE } from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";

export function TokenLaunchpad() {

    const wallet = useWallet();

    async function createToken() {
        const lamports = await getMinimumBalanceForRentExemptMint(connection);
        const keypair = Keypair.generate();

        const transaction = new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey: payer.publicKey,
                newAccountPubkey: keypair.publicKey,
                space: MINT_SIZE,
                lamports,
                programId
            }),
            createInitializeAccount2Instruction(keypair.publicKey, decimals, mintAuthority, freezeAuthority,programId)
        );
        transaction.partialSign(keypair);
        
        await wallet.signTransaction(transaction);
    } 

    return  <div style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    }}>
        <h1>Solana Token Launchpad</h1>
        <input className='inputText' type='text' placeholder='Name'></input> <br />
        <input className='inputText' type='text' placeholder='Symbol'></input> <br />
        <input className='inputText' type='text' placeholder='Image URL'></input> <br />
        <input className='inputText' type='text' placeholder='Initial Supply'></input> <br />
        <button onClick={createToken} className='btn'>Create a token</button>
    </div>
}