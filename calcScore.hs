import System.Environment

calc :: (Integral t) => t -> [t] -> [t]
calc precentage nums = map (\num -> truncate ((fromIntegral num) * (fromIntegral precentage) / (fromIntegral 100))) nums

processInput :: Int -> IO ()
processInput precentage = do
  inp <- getLine
  let nums = [read numStr | numStr <- words inp ] :: [Int]
  let res = unwords ( map show ( calc precentage nums ) )
  putStrLn res
  processInput precentage
  return ()

main = do
  args <- getArgs
  if length args /= 1 then error "./calcScore precentage" else processInput ( read ( head args ) )
