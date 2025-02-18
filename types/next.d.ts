type NextHandler<R = unknown, T = unknown> = (
  req: Request,
  response: NextResponse<T>,
) => Promise<R>;

type NextVoidHandler<T = unknown> = NextHandler<void, T>;
