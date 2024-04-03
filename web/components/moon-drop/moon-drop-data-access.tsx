'use client';

import { MoonDropIDL, getMoonDropProgramId } from '@moon-drop/anchor';
import { Program } from '@coral-xyz/anchor';
import { useConnection } from '@solana/wallet-adapter-react';
import { Cluster, Keypair, PublicKey } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useCluster } from '../cluster/cluster-data-access';
import { useAnchorProvider } from '../solana/solana-provider';
import { useTransactionToast } from '../ui/ui-layout';

export function useMoonDropProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getMoonDropProgramId(cluster.network as Cluster),
    [cluster]
  );
  const program = new Program(MoonDropIDL, programId, provider);

  const accounts = useQuery({
    queryKey: ['moon-drop', 'all', { cluster }],
    queryFn: () => program.account.moonDrop.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const initialize = useMutation({
    mutationKey: ['moon-drop', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods
        .initialize()
        .accounts({ moonDrop: keypair.publicKey })
        .signers([keypair])
        .rpc(),
    onSuccess: (signature) => {
      transactionToast(signature);
      return accounts.refetch();
    },
    onError: () => toast.error('Failed to initialize account'),
  });

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  };
}

export function useMoonDropProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, accounts } = useMoonDropProgram();

  const accountQuery = useQuery({
    queryKey: ['moon-drop', 'fetch', { cluster, account }],
    queryFn: () => program.account.moonDrop.fetch(account),
  });

  const closeMutation = useMutation({
    mutationKey: ['moon-drop', 'close', { cluster, account }],
    mutationFn: () =>
      program.methods.close().accounts({ moonDrop: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accounts.refetch();
    },
  });

  const decrementMutation = useMutation({
    mutationKey: ['moon-drop', 'decrement', { cluster, account }],
    mutationFn: () =>
      program.methods.decrement().accounts({ moonDrop: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  const incrementMutation = useMutation({
    mutationKey: ['moon-drop', 'increment', { cluster, account }],
    mutationFn: () =>
      program.methods.increment().accounts({ moonDrop: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  const setMutation = useMutation({
    mutationKey: ['moon-drop', 'set', { cluster, account }],
    mutationFn: (value: number) =>
      program.methods.set(value).accounts({ moonDrop: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  };
}
