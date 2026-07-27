import { Question } from '../types';
import { DOCKER_QUESTIONS } from './questions/docker';
import { K8S_QUESTIONS } from './questions/k8s';
import { LINUX_QUESTIONS } from './questions/linux';
import { CICD_QUESTIONS } from './questions/cicd';
import { TERRAFORM_QUESTIONS } from './questions/terraform';
import { MONITORING_QUESTIONS } from './questions/monitoring';
import { NETWORKING_QUESTIONS } from './questions/networking';
import { CLOUD_QUESTIONS } from './questions/cloud';
import { ANSIBLE_QUESTIONS } from './questions/ansible';
import { ADMIN_20_QUESTIONS } from './questions/admin_20';
import { COMMUNITY_2026_QUESTIONS } from './questions/community_2026';

export const QUESTIONS: Question[] = [
  ...DOCKER_QUESTIONS,
  ...K8S_QUESTIONS,
  ...LINUX_QUESTIONS,
  ...CICD_QUESTIONS,
  ...TERRAFORM_QUESTIONS,
  ...MONITORING_QUESTIONS,
  ...NETWORKING_QUESTIONS,
  ...CLOUD_QUESTIONS,
  ...ANSIBLE_QUESTIONS,
  ...ADMIN_20_QUESTIONS,
  ...COMMUNITY_2026_QUESTIONS,
];
