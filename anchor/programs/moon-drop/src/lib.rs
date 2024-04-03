#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("EZCKQSLEGYUWNAnFtHqneiZWJ7FvSgYnjpAwVPrkJ3uE");

#[program]
pub mod moon_drop {
    use super::*;

  pub fn close(_ctx: Context<CloseMoonDrop>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.moon_drop.count = ctx.accounts.moon_drop.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.moon_drop.count = ctx.accounts.moon_drop.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeMoonDrop>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.moon_drop.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeMoonDrop<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + MoonDrop::INIT_SPACE,
  payer = payer
  )]
  pub moon_drop: Account<'info, MoonDrop>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseMoonDrop<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub moon_drop: Account<'info, MoonDrop>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub moon_drop: Account<'info, MoonDrop>,
}

#[account]
#[derive(InitSpace)]
pub struct MoonDrop {
  count: u8,
}
