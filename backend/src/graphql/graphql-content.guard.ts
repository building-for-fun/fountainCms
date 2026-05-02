import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ALLOW_ANONYMOUS_PUBLISHED_KEY } from '../auth/decorators/allow-anonymous-published.decorator';
import {
  AuthApplyService,
  type FountainAuthRequest,
} from '../auth/auth-apply.service';
import { ContentAuthorizationService } from '../content/content-authorization.service';
import { CONTENT_GRAPHQL_OPERATION_KEY } from './decorators/require-content-operation.decorator';
import type { ContentOperation } from '../content/content-permissions';
import { OperationTypeNode, type GraphQLResolveInfo } from 'graphql';

@Injectable()
export class GraphqlContentGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authApply: AuthApplyService,
    private readonly contentAuth: ContentAuthorizationService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlCtx = GqlExecutionContext.create(context);
    const req = gqlCtx.getContext<{ req: FountainAuthRequest }>().req;
    const info = gqlCtx.getInfo<GraphQLResolveInfo>();
    const isMutation = info.operation.operation === OperationTypeNode.MUTATION;

    const allowAnonPublished = this.reflector.getAllAndOverride<boolean>(
      ALLOW_ANONYMOUS_PUBLISHED_KEY,
      [context.getHandler(), context.getClass()],
    );

    await this.authApply.apply(req, {
      allowAnonymousPublishedWhen: Boolean(allowAnonPublished) && !isMutation,
    });

    const declaredOp = this.reflector.getAllAndOverride<
      ContentOperation | undefined
    >(CONTENT_GRAPHQL_OPERATION_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isMutation && !declaredOp) {
      throw new BadRequestException(
        'Mutation resolver must set @RequireContentOperation(...)',
      );
    }

    const operation: ContentOperation = declaredOp ?? 'read';

    const args = gqlCtx.getArgs<{ collection?: string }>();
    const collection = args.collection;
    if (!collection?.trim()) {
      throw new BadRequestException('collection argument is required');
    }

    await this.contentAuth.ensureAccess(req, collection, operation);
    return true;
  }
}
