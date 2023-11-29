import { config } from '@/config/config';

import { Partner } from '@/modules/partners/domain/Partner';
import { PartnerRepository } from '@/modules/partners/domain/PartnerRepository';
import { PartnerUsers } from '@/modules/partners/domain/PartnerUsers';

export function createPartnerRepository(): PartnerRepository {
  return {
    getAll,
    getInfo,
    getUsers,
  };
}

export async function getAll() {
  try {
    const response = await fetch(`${config.backendUrl}/partners`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Error fetching partners');
    }

    const partners = response.json() as Promise<Partner[]>;
    return partners;
  } catch (error) {
    throw new Error('Error fetching partners');
  }
}

export async function getInfo(id: number) {
  try {
    const response = await fetch(`${config.backendUrl}/partners/${id}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Error fetching partner info');
    }

    const partnerInfo = response.json() as Promise<Partner>;
    return partnerInfo;
  } catch (error) {
    throw new Error('Error fetching partner info');
  }
}

export async function getUsers(id: number) {
  try {
    const response = await fetch(
      `${config.backendUrl}/partners/${id}/members`,
      {
        credentials: 'include',
      },
    );

    if (!response.ok) {
      throw new Error('Error fetching partner users');
    }

    const partnerUsers = response.json() as Promise<PartnerUsers>;
    return partnerUsers;
  } catch (error) {
    throw new Error('Error fetching partner users');
  }
}
