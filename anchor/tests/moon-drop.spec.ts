import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Keypair } from '@solana/web3.js';
import { MoonDrop } from '../target/types/moon_drop';

describe('moon-drop', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const payer = provider.wallet as anchor.Wallet;

  const program = anchor.workspace.MoonDrop as Program<MoonDrop>;

  const moonDropKeypair = Keypair.generate();

  it('Initialize MoonDrop', async () => {
    await program.methods
      .initialize()
      .accounts({
        moonDrop: moonDropKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([moonDropKeypair])
      .rpc();

    const currentCount = await program.account.moonDrop.fetch(
      moonDropKeypair.publicKey
    );

    expect(currentCount.count).toEqual(0);
  });

  it('Increment MoonDrop', async () => {
    await program.methods
      .increment()
      .accounts({ moonDrop: moonDropKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.moonDrop.fetch(
      moonDropKeypair.publicKey
    );

    expect(currentCount.count).toEqual(1);
  });

  it('Increment MoonDrop Again', async () => {
    await program.methods
      .increment()
      .accounts({ moonDrop: moonDropKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.moonDrop.fetch(
      moonDropKeypair.publicKey
    );

    expect(currentCount.count).toEqual(2);
  });

  it('Decrement MoonDrop', async () => {
    await program.methods
      .decrement()
      .accounts({ moonDrop: moonDropKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.moonDrop.fetch(
      moonDropKeypair.publicKey
    );

    expect(currentCount.count).toEqual(1);
  });

  it('Set moonDrop value', async () => {
    await program.methods
      .set(42)
      .accounts({ moonDrop: moonDropKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.moonDrop.fetch(
      moonDropKeypair.publicKey
    );

    expect(currentCount.count).toEqual(42);
  });

  it('Set close the moonDrop account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        moonDrop: moonDropKeypair.publicKey,
      })
      .rpc();

    // The account should no longer exist, returning null.
    const userAccount = await program.account.moonDrop.fetchNullable(
      moonDropKeypair.publicKey
    );
    expect(userAccount).toBeNull();
  });
});
